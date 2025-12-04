<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewAdminController extends Controller
{
    /**
     * Menampilkan daftar review
     */
    public function index()
    {
        // 1. Ambil data review dengan Eager Loading
        $reviews = Review::with(['customer', 'admin', 'instansi'])
            ->latest()
            ->paginate(10)
            ->through(function ($review) {
                return [
                    'id' => $review->id_review,
                    'content' => $review->content,
                    'author' => $review->author_name,
                    'image' => $review->author_image,
                    'date' => $review->created_at->format('d M Y'),
                ];
            });

        // 2. Render ke halaman React (Sesuai lokasi file Anda: Admin/Review.tsx)
        return Inertia::render('Admin/Review', [
            'reviews' => $reviews
        ]);
    }
    /**
     * Menyimpan review baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        // Buat data baru
        Review::create([
            'id_admin' => auth()->guard('admin')->id(),
            'content' => $request->input('content'),
            // id_customer dan id_instanasi otomatis null
        ]);

        return redirect()->back()->with('success', 'Review berhasil ditambahkan');
    }

    /**
     * Update review (Edit konten)
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $review = Review::findOrFail($id);

        // PERBAIKAN: Menggunakan fill() dan save() untuk menghilangkan error merah di editor.
        // Ini fungsinya sama persis dengan $review->update(), tapi lebih jelas bagi VS Code.
        $review->fill([
            'content' => $request->input('content'),
        ]);

        $review->save();

        return redirect()->back()->with('success', 'Review berhasil diperbarui');
    }

    /**
     * Hapus review
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return redirect()->back()->with('success', 'Review berhasil dihapus');
    }
}