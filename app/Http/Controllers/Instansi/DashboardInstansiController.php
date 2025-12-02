<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Carbon\Carbon;

class DashboardInstansiController extends Controller
{
    public function index(Request $request)
    {
        // ===== 1. Ambil instansi login =====
        $instansi = Auth::guard('instansi')->user();

        if (!$instansi) {
            abort(401, 'Instansi tidak terautentikasi');
        }

        $instansiName = $instansi->nama_instansi
            ?? $instansi->nama
            ?? $instansi->nama_perusahaan
            ?? 'Instansi Anda';

        $instansiTagline = $instansiName . ', Mari Bertumbuh Lebih Cepat.';

        // ===== 2. Ambil semua file Excel di storage/app/public/instansi_peserta =====
        $disk      = Storage::disk('public');            // root = storage/app/public
        $directory = 'instansi_peserta';

        $files = collect($disk->files($directory))
            ->filter(function ($path) {
                return preg_match('/\.(xlsx|xls)$/i', $path);
            });

        // Kalau belum ada file sama sekali
        if ($files->isEmpty()) {
            return Inertia::render('Instansi/dashboard', [
                'summary'          => [
                    'total_participants' => 0,
                    'latest_reports'     => 0,
                ],
                'hasilTes'         => [],
                'pieData'          => [],
                'orgData'          => [],
                'instansi_name'    => $instansiName,
                'instansi_tagline' => $instansiTagline,
            ]);
        }

        // ===== 3. Siapkan penampung data =====
        $hasilTes      = [];
        $globalCounter = 0;
        $genderCounts  = [];  // pie chart (jenis kelamin)
        $cityCounts    = [];  // bar chart (kota/divisi)

        // ===== 4. Baca SELURUH file peserta_*.xlsx =====
        foreach ($files as $path) {
            $fullPath = $disk->path($path);

            try {
                $reader      = IOFactory::createReaderForFile($fullPath);
                $spreadsheet = $reader->load($fullPath);
                $sheet       = $spreadsheet->getActiveSheet();
                $rows        = $sheet->toArray(null, true, true, true); // index: [row][A..I]

                if (count($rows) <= 1) {
                    // cuma header, tidak ada data
                    continue;
                }

                $isFirstRow = true;
                foreach ($rows as $row) {
                    // Lewati baris pertama (header)
                    if ($isFirstRow) {
                        $isFirstRow = false;
                        continue;
                    }

                    // Ambil sesuai kolom template
                    $nama   = trim((string) ($row['A'] ?? ''));
                    $city   = trim((string) ($row['F'] ?? ''));
                    $gender = trim((string) ($row['G'] ?? ''));
                    $email  = trim((string) ($row['C'] ?? ''));
                    $tglRaw = $row['I'] ?? null;

                    // Kalau semua benar2 kosong, skip
                    if ($nama === '' && $city === '' && $gender === '' && $email === '' && ($tglRaw === null || $tglRaw === '')) {
                        continue;
                    }

                    $globalCounter++;

                    // ===== pie: jenis kelamin =====
                    $genderKey = $gender !== '' ? $gender : 'Tidak diketahui';
                    $genderCounts[$genderKey] = ($genderCounts[$genderKey] ?? 0) + 1;

                    // ===== bar: kota/divisi =====
                    $cityKey = $city !== '' ? $city : 'Lainnya';
                    $cityCounts[$cityKey] = ($cityCounts[$cityKey] ?? 0) + 1;

                    // ===== tanggal lahir =====
                    $tglFmt = '';
                    if ($tglRaw !== null && $tglRaw !== '') {
                        try {
                            if (is_numeric($tglRaw)) {
                                $dateTime = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($tglRaw);
                                $tglFmt   = Carbon::instance($dateTime)->format('d-m-Y');
                            } else {
                                $tglFmt   = Carbon::parse($tglRaw)->format('d-m-Y');
                            }
                        } catch (\Throwable $e) {
                            $tglFmt = (string) $tglRaw;
                        }
                    }

                    $hasilTes[] = [
                        'no'     => $globalCounter,
                        'nama'   => $nama !== '' ? $nama : '-',
                        'devisi' => $cityKey,
                        'tgl'    => $tglFmt,
                        'email'  => $email !== '' ? $email : '-',
                    ];
                }
            } catch (\Throwable $e) {
                // Jika file ini bermasalah, lewati saja
                continue;
            }
        }

        // ===== 5. Summary =====
        $totalParticipants = count($hasilTes);

        $latestReports = $files->filter(function ($path) use ($disk) {
            $timestamp = $disk->lastModified($path);
            return Carbon::createFromTimestamp($timestamp)->gte(now()->subDays(7));
        })->count();

        $summary = [
            'total_participants' => $totalParticipants,
            'latest_reports'     => $latestReports,
        ];

        // ===== 6. Konversi ke format chart =====
        $pieData = [];
        foreach ($genderCounts as $label => $count) {
            $pieData[] = [
                'label' => $label,
                'value' => $count,
            ];
        }

        $orgData = [];
        foreach ($cityCounts as $label => $count) {
            $orgData[] = [
                'label' => $label,
                'value' => $count,
            ];
        }

        // ===== 7. Kirim ke frontend =====
        return Inertia::render('Instansi/dashboard', [
            'summary'          => $summary,
            'hasilTes'         => $hasilTes,
            'pieData'          => $pieData,
            'orgData'          => $orgData,
            'instansi_name'    => $instansiName,
            'instansi_tagline' => $instansiTagline,
        ]);
    }
}
