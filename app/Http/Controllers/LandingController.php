<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LandingController extends Controller
{
    public function index()
    {
        // LOGIC: Ambil hanya 3 data terbaru
        $testimonials = Review::latest() // Mengurutkan dari yang terbaru (created_at desc)
            ->take(3) // BATASI HANYA 3 DATA
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id_review,
                    // Pastikan aksesors ini ada di Model Review.php Anda
                    'name' => $review->author_name,
                    'text' => $review->content,
                    'image' => $review->author_image,
                ];
            });

        // Kirim ke Frontend
        return Inertia::render('landing', [
            'testimonials' => $testimonials
        ]);
    }
}