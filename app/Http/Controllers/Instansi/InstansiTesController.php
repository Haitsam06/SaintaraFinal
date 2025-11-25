<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Paket;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Support\Facades\Storage;

class InstansiTesController extends Controller
{
    /**
     * 1. Halaman daftar paket TES INSTANSI
     */
    public function index()
    {
        $pakets = Paket::select('id_paket', 'nama_paket', 'harga', 'deskripsi', 'jumlah_karakter')
            ->whereIn('id_paket', [
                'INST_ADMIN_REPEAT',
                'INST_ADMIN_ONETIME',
                'INST_QUOTA_25',
            ])
            ->get();

        $daftarPaket = $pakets->map(function ($p) {
            return [
                'id_paket'        => $p->id_paket,
                'nama_paket'      => $p->nama_paket,
                'harga'           => (int) $p->harga,
                'deskripsi'       => $p->deskripsi,
                'jumlah_karakter' => $p->jumlah_karakter,
                'has_token'       => true,
            ];
        });

        return Inertia::render('Instansi/DaftarTes', [
            'daftar_paket' => $daftarPaket,
        ]);
    }

    /**
     * 2. Form upload Excel + input manual peserta.
     *    /instansi/formTesInstansi?paket_id=INST_QUOTA_25
     */
    public function form(Request $request)
    {
        $request->validate([
            'paket_id' => 'required|exists:pakets,id_paket',
        ]);

        $paket = Paket::where('id_paket', $request->paket_id)->firstOrFail();

        $testPackage = [
            'id'          => (string) $paket->id_paket,
            'slug'        => (string) $paket->id_paket,
            'title'       => $paket->nama_paket,
            'description' => $paket->deskripsi,
            'token_cost'  => (int) $paket->harga,
        ];

        return Inertia::render('Instansi/form-tes-instansi', [
            'test_package' => $testPackage,
            'wa_url'       => session('wa_url'),
            'success'      => session('success'),
        ]);
    }

    public function uploadExcel(Request $request)
    {
        $validated = $request->validate([
            'test_package_id'            => 'required|exists:pakets,id_paket',
            'nama_golongan'              => 'required|string|max:255',

            'file'                       => 'nullable|file|mimes:xlsx,xls|max:5120',

            'participants'               => 'nullable|array',
            'participants.*.full_name'   => 'nullable|string|max:255',
            'participants.*.nickname'    => 'nullable|string|max:255',
            'participants.*.email'       => 'nullable|email',
            'participants.*.phone'       => 'nullable|string|max:50',
            'participants.*.country'     => 'nullable|string|max:100',
            'participants.*.city'        => 'nullable|string|max:100',
            'participants.*.gender'      => 'nullable|string|max:50',
            'participants.*.blood_type'  => 'nullable|string|max:5',
        ]);

        $hasFile       = $request->hasFile('file');
        $manualPeserta = $validated['participants'] ?? [];

        if (!$hasFile && empty($manualPeserta)) {
            return back()->withErrors([
                'participants' => 'Isi minimal satu peserta manual atau upload file Excel.',
            ])->withInput();
        }

        $paket = Paket::where('id_paket', $validated['test_package_id'])->firstOrFail();

        $rows = [];

        $header = [
            'Nama Lengkap',
            'Nama Panggilan',
            'Email',
            'No. Telepon',
            'Negara',
            'Kota / Divisi',
            'Jenis Kelamin',
            'Golongan Darah',
            'Tanggal Lahir',
        ];

        // 1A. Dari Excel
        if ($hasFile) {
            try {
                $sheet     = IOFactory::load($request->file('file')->getRealPath())->getActiveSheet();
                $excelRows = $sheet->toArray(null, true, true, true);

                foreach ($excelRows as $i => $row) {
                    if ($i === 1) continue;                      // header
                    if (empty($row['A']) && empty($row['C'])) continue; // minimal nama/email

                    $rows[] = [
                        $row['A'] ?? '',
                        $row['B'] ?? '',
                        $row['C'] ?? '',
                        $row['D'] ?? '',
                        $row['E'] ?? '',
                        $row['F'] ?? '',
                        $row['G'] ?? '',
                        $row['H'] ?? '',
                        $row['I'] ?? '',
                    ];
                }
            } catch (\Throwable $e) {
                return back()->withErrors([
                    'file' => 'File Excel tidak valid atau rusak.',
                ])->withInput();
            }
        }

        // 1B. Dari input manual
        foreach ($manualPeserta as $p) {
            if (empty($p['full_name']) && empty($p['email'])) {
                continue;
            }

            $rows[] = [
                $p['full_name']  ?? '',
                $p['nickname']   ?? '',
                $p['email']      ?? '',
                $p['phone']      ?? '',
                $p['country']    ?? '',
                $p['city']       ?? '',
                $p['gender']     ?? '',
                $p['blood_type'] ?? '',
                '',
            ];
        }

        if (empty($rows)) {
            return back()->withErrors([
                'participants' => 'Tidak ada data peserta valid.',
            ])->withInput();
        }

        $spreadsheet = new Spreadsheet();
        $sheet       = $spreadsheet->getActiveSheet();

        $sheet->fromArray($header, null, 'A1');

        foreach ($rows as $i => $r) {
            $sheet->fromArray($r, null, 'A' . (2 + $i));
        }

        $folder   = 'instansi_peserta';
        $fileName = 'peserta_' . $paket->id_paket . '_' . now()->format('Ymd_His') . '.xlsx';

        Storage::disk('public')->makeDirectory($folder);

        $path = $folder . '/' . $fileName;
        (new Xlsx($spreadsheet))->save(Storage::disk('public')->path($path));

        // pakai route download, BUKAN asset('storage/...')
        $fileUrl = route('instansi.downloadPeserta', ['filename' => $fileName]);

        $nomorAdmin = '6282169799967';

        $pesan = "
*DATA PESERTA TES SAINTARA (INSTANSI)*

Paket : *{$paket->nama_paket}*
Golongan : *{$validated['nama_golongan']}*

File Excel peserta:
{$fileUrl}

Terima kasih.
        ";

        $waUrl = 'https://wa.me/' . $nomorAdmin . '?text=' . urlencode(trim($pesan));

        return redirect()
            ->to('/instansi/formTesInstansi?paket_id=' . $validated['test_package_id'])
            ->with('wa_url', $waUrl)
            ->with('success', 'Data peserta berhasil diproses.');
    }

    /**
     * 4. Route download: dipanggil dari link yang dikirim ke WhatsApp.
     */
    public function downloadPeserta(string $filename)
    {
        $path = 'instansi_peserta/' . $filename;

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return Storage::disk('public')->download($path);
    }

    /**
     * 5. Download template form peserta untuk tombol "Unduh Form Tes" di dashboard.
     */
    public function downloadFormTemplate()
    {
        // Simpan template di: storage/app/public/instansi_peserta/form_peserta_instansi.xlsx
        $path = 'instansi_peserta/form_peserta_instansi.xlsx';

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'Template form peserta tidak ditemukan.');
        }

        return Storage::disk('public')->download(
            $path,
            'Form_Peserta_Instansi.xlsx'
        );
    }
}
