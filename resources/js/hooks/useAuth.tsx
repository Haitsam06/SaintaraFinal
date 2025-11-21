import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: number[];
}

export const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
    // 1. AMBIL DATA USER DARI INERTIA (SERVER), BUKAN LOCALSTORAGE
    // Data ini didapat dari HandleInertiaRequests.php yang sudah kita perbaiki
    const { auth } = usePage().props as any;
    const user = auth.user;

    useEffect(() => {
        // 2. Cek Login: Jika user dari server kosong, tendang ke login
        if (!user) {
            window.location.href = '/login';
            return;
        }

        // 3. Cek Role: Jika halaman butuh role khusus
        if (requiredRoles.length > 0) {
            // Pastikan field role_id ada (sesuai Model Admin.php)
            const userRole = user.role_id;

            if (!requiredRoles.includes(userRole)) {
                alert('Anda tidak memiliki akses ke halaman ini.');
                window.location.href = '/'; // Redirect jika salah role
            }
        }
    }, [user, requiredRoles]);

    // TAMPILAN SAAT MEMUAT / REDIRECT
    if (!user) {
        return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Memeriksa sesi login...</div>;
    }

    // JIKA SUDAH LOGIN TAPI ROLE TIDAK COCOK (Tunggu useEffect redirect)
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role_id)) {
        return null;
    }

    // JIKA AMAN, TAMPILKAN HALAMAN
    return <>{children}</>;
};
