<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Carbon\Carbon;

class DashboardInstansiController extends Controller
{
    /**
     * Tampilkan dashboard instansi dengan data dari Excel.
     */
    public function index(Request $request)
    {
        // Instansi yang sedang login
        $instansi = $request->user('instansi');

        if (!$instansi) {
            abort(401, 'Instansi tidak terautentikasi');
        }

        $instansiId = $instansi->id_instansi;

        // Folder excel peserta
        $disk = Storage::disk('public');
        $directory = 'instansi_peserta';

        // Ambil semua file Excel di folder instansi_peserta
        $allFiles = collect($disk->files($directory))
            ->filter(function ($path) {
                // hanya file xlsx/xls
                return preg_match('/\.(xlsx|xls)$/i', $path);
            });

        // Filter file khusus instansi (berdasarkan id_instansi di nama file)
        $instansiFiles = $allFiles->filter(function ($path) use ($instansiId) {
            $filename = basename($path);
            return str_contains($filename, $instansiId);
        });

        // Kalau tidak ketemu satupun, pakai semua file (fallback)
        if ($instansiFiles->isEmpty()) {
            $instansiFiles = $allFiles;
        }

        $hasilTes   = [];
        $globalCounter = 0;
        $pieData   = [];   // untuk pie chart: { label, value } per file
        $orgCounts = [];   // untuk bar chart: { devisi => count }

        foreach ($instansiFiles as $path) {
            $fullPath = $disk->path($path);

            try {
                $reader = IOFactory::createReaderForFile($fullPath);
                $spreadsheet = $reader->load($fullPath);
                $sheet = $spreadsheet->getActiveSheet();
                $rows = $sheet->toArray(null, true, true, true); // array[ row ][col ]

                if (count($rows) <= 1) {
                    continue; // cuma header / kosong
                }

                // Ambil header (baris pertama) untuk cari kolom
                $header = array_shift($rows); // sekarang $rows berisi data

                // Fungsi bantu: cari key kolom berdasarkan keyword pada header
                $findCol = function (array $headerRow, array $keywords) {
                    foreach ($headerRow as $colKey => $colName) {
                        $lower = strtolower(trim((string) $colName));
                        foreach ($keywords as $kw) {
                            if ($lower === $kw || str_contains($lower, $kw)) {
                                return $colKey;
                            }
                        }
                    }
                    return null;
                };

                $colNama   = $findCol($header, ['nama', 'name']);
                $colDevisi = $findCol($header, ['devisi', 'divisi', 'departemen', 'jurusan']);
                $colTgl    = $findCol($header, ['tanggal', 'tgl', 'tanggal tes', 'tgl tes']);
                $colEmail  = $findCol($header, ['email', 'e-mail']);

                $fileParticipantCount = 0;

                foreach ($rows as $row) {
                    // Skip baris kosong total
                    if (implode('', array_map('trim', $row)) === '') {
                        continue;
                    }

                    $globalCounter++;
                    $fileParticipantCount++;

                    // ambil value per kolom
                    $nama   = $colNama   ? ($row[$colNama] ?? '') : '';
                    $devisi = $colDevisi ? ($row[$colDevisi] ?? null) : null;
                    $email  = $colEmail  ? ($row[$colEmail] ?? '') : '';

                    // hitung organisasi (per devisi)
                    $keyDevisi = $devisi ? trim((string) $devisi) : 'Lainnya';
                    $orgCounts[$keyDevisi] = ($orgCounts[$keyDevisi] ?? 0) + 1;

                    $tglRaw = $colTgl ? ($row[$colTgl] ?? null) : null;
                    $tglFmt = '';

                    if ($tglRaw) {
                        try {
                            // PhpSpreadsheet bisa kasih numerik (format Excel) atau string tanggal
                            if (is_numeric($tglRaw)) {
                                $dateTime = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($tglRaw);
                                $tglFmt = Carbon::instance($dateTime)->format('d-m-Y');
                            } else {
                                $tglFmt = Carbon::parse($tglRaw)->format('d-m-Y');
                            }
                        } catch (\Throwable $e) {
                            $tglFmt = (string) $tglRaw;
                        }
                    }

                    $hasilTes[] = [
                        'no'     => $globalCounter,
                        'nama'   => $nama ?: '-',
                        'devisi' => $devisi ?: null,
                        'tgl'    => $tglFmt,
                        'email'  => $email ?: '-',
                    ];
                }

                // Tambahkan ke data pie chart (jumlah peserta per file)
                $pieData[] = [
                    'label' => pathinfo($path, PATHINFO_FILENAME),
                    'value' => $fileParticipantCount,
                ];
            } catch (\Throwable $e) {
                // Kalau ada error baca file, lewati saja agar dashboard tetap jalan
                continue;
            }
        }

        // ===== SUMMARY =====
        $totalParticipants = count($hasilTes);

        // latest_reports: jumlah file Excel yang dimodifikasi dalam 7 hari terakhir
        $latestReports = $instansiFiles->filter(function ($path) use ($disk) {
            $timestamp = $disk->lastModified($path);
            return Carbon::createFromTimestamp($timestamp)->gte(now()->subDays(7));
        })->count();

        $summary = [
            'total_participants' => $totalParticipants,
            'latest_reports'     => $latestReports,
        ];

        // ===== DATA ORGANISASI (BAR CHART) =====
        $orgData = [];
        foreach ($orgCounts as $label => $count) {
            $orgData[] = [
                'label' => $label,
                'value' => $count,
            ];
        }

        return Inertia::render('Instansi/Dashboard', [
            'summary'   => $summary,
            'hasilTes'  => $hasilTes,
            'pieData'   => $pieData,
            'orgData'   => $orgData,
        ]);
    }
}
