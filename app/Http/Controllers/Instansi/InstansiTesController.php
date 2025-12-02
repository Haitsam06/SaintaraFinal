<?php

namespace App\Http\Controllers\Instansi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Models\Paket;
use App\Models\Token;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class InstansiTesController extends Controller
{
    /**
     * 1. Halaman daftar paket TES INSTANSI
     *    /instansi/tesInstansi
     */
    public function index()
    {
        // Ambil semua paket instansi yang boleh ditampilkan
        // (di db kamu id_paket: DSR, PRM, STD)
        $pakets = Paket::select('id_paket', 'nama_paket', 'harga', 'deskripsi', 'jumlah_karakter')
            ->whereIn('id_paket', ['DSR', 'PRM', 'STD'])
            ->get();

        // Instansi login
        $instansi = Auth::guard('instansi')->user();

        // Hitung saldo token per paket untuk instansi ini
        $tokenPerPaket = [];
        if ($instansi) {
            $tokenPerPaket = Token::where('instansi_id', $instansi->id_instansi)
                ->where('status', 'belum digunakan')
                ->select('paket_id', DB::raw('COUNT(*) as total'))
                ->groupBy('paket_id')
                ->pluck('total', 'paket_id')
                ->toArray();
        }

        $daftarPaket = $pakets->map(function ($p) use ($tokenPerPaket) {
            $tokenPaket = $tokenPerPaket[$p->id_paket] ?? 0;

            return [
                'id_paket'        => $p->id_paket,
                'nama_paket'      => $p->nama_paket,
                'harga'           => (int) $p->harga,
                'deskripsi'       => $p->deskripsi,
                'jumlah_karakter' => $p->jumlah_karakter,
                'has_token'       => $tokenPaket > 0, // tombol "Mulai Tes" kalau > 0
            ];
        });

        return Inertia::render('Instansi/DaftarTes', [
            'daftar_paket' => $daftarPaket,
        ]);
    }

    /**
     * 2. Form upload Excel + input manual peserta.
     *    /instansi/formTesInstansi?paket_id=PRM
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

        $instansi = Auth::guard('instansi')->user();

        // saldo token hanya untuk paket ini (PRM / DSR / STD)
        $saldoTokenPaket = 0;
        if ($instansi) {
            $saldoTokenPaket = Token::where('instansi_id', $instansi->id_instansi)
                ->where('paket_id', $paket->id_paket)
                ->where('status', 'belum digunakan')
                ->count();
        }

        return Inertia::render('Instansi/form-tes-instansi', [
            'test_package' => $testPackage,
            'saldo_token'  => $saldoTokenPaket,        // ditampilkan di form
            'wa_url'       => session('wa_url'),
            'success'      => session('success'),
            'errors'       => session('errors') ? session('errors')->toArray() : [],
        ]);
    }

    /**
     * 3. Submit form:
     *    - gabung peserta Excel + manual ke 1 file
     *    - cek token paket
     *    - jika cukup: kurangi token (status = 'digunakan')
     *    - kirim link file ke WA (via session)
     */
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

        // 1A. Peserta dari Excel
        if ($hasFile) {
            try {
                $sheet     = IOFactory::load($request->file('file')->getRealPath())->getActiveSheet();
                $excelRows = $sheet->toArray(null, true, true, true);

                foreach ($excelRows as $i => $row) {
                    if ($i === 1) continue;                          // header
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

        // 1B. Peserta dari input manual
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

        // ========== CEK & POTONG TOKEN DALAM TRANSAKSI ==========
        $instansi = Auth::guard('instansi')->user();

        if (!$instansi) {
            return redirect()->route('login');
        }

        $totalPeserta    = count($rows);
        $tokenDibutuhkan = $totalPeserta; // 1 token / peserta

        try {
            DB::transaction(function () use (
                $instansi,
                $paket,
                $tokenDibutuhkan,
                $rows,
                $header,
                $validated,
                &$waUrl
            ) {
                // 1. Hitung token aktif untuk paket ini
                $saldoTokenPaket = Token::where('instansi_id', $instansi->id_instansi)
                    ->where('paket_id', $paket->id_paket)
                    ->where('status', 'belum digunakan')
                    ->lockForUpdate()
                    ->count();

                // aturan user: token_dibutuhkan >= token_tersedia => tidak mencukupi
                if ($tokenDibutuhkan >= $saldoTokenPaket) {
                    throw new \RuntimeException(
                        "Token anda tidak mencukupi untuk paket {$paket->nama_paket}. " .
                        "Token tersedia: {$saldoTokenPaket}, peserta: {$tokenDibutuhkan}."
                    );
                }

                // 2. Ambil token yang akan dipakai & update status
                $tokens = Token::where('instansi_id', $instansi->id_instansi)
                    ->where('paket_id', $paket->id_paket)
                    ->where('status', 'belum digunakan')
                    ->orderBy('created_at')
                    ->lockForUpdate()
                    ->limit($tokenDibutuhkan)
                    ->get();

                foreach ($tokens as $t) {
                    $t->status       = 'digunakan';   // SESUAI ENUM
                    $t->tglPemakaian = now();
                    $t->save();
                }

                // 3. Generate file Excel gabungan
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

                // 4. Link download untuk WhatsApp
                $fileUrl    = route('instansi.downloadPeserta', ['filename' => $fileName]);
                $nomorAdmin = '6282169799967';

                $pesan = "
*DATA PESERTA TES SAINTARA (INSTANSI)*

Paket : *{$paket->nama_paket}*
Golongan : *{$validated['nama_golongan']}*

Total Peserta : *{$tokenDibutuhkan}*
Token Dibutuhkan : *{$tokenDibutuhkan}*

File Excel peserta:
{$fileUrl}

Terima kasih.
                ";

                $waUrl = 'https://wa.me/' . $nomorAdmin . '?text=' . urlencode(trim($pesan));
            });
        } catch (\RuntimeException $e) {
            // error karena token tidak cukup
            return back()->withErrors([
                'participants' => $e->getMessage(),
            ])->withInput();
        }

        // kalau sampai sini berarti sukses & $waUrl terisi
        return redirect()
            ->to('/instansi/formTesInstansi?paket_id=' . $validated['test_package_id'])
            ->with('wa_url', $waUrl)
            ->with('success', 'Data peserta berhasil diproses dan token telah dipotong.');
    }

    /**
     * 4. Download file peserta (dipakai dari link WA).
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
     * 5. Download template form peserta.
     *    File disimpan di: public/templates/peserta_instansi.xlsx
     */
    public function downloadFormTemplate()
    {
        $fullPath = public_path('templates/peserta_instansi.xlsx');

        if (!file_exists($fullPath)) {
            abort(404, 'Template form peserta tidak ditemukan.');
        }

        return response()->download($fullPath, 'Template_Peserta_Instansi.xlsx');
    }
}
