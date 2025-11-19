import React, { useEffect, useState } from 'react';

// BAGIAN INI YANG PENTING (Definisi Tipe Data)
// Kita memberi tahu TypeScript bahwa komponen ini boleh menerima 'requiredRoles'
interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: number[]; // Array angka, tanda '?' artinya opsional
}

// Perhatikan bagian props: ({ children, requiredRoles = [] }: ProtectedRouteProps)
export const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        // 1. Ambil token & data user
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('user_data');

        // 2. Jika data tidak lengkap, lempar ke login
        if (!token || !userDataStr) {
            window.location.href = '/login';
            return;
        }

        try {
            const user = JSON.parse(userDataStr);

            // 3. Cek Role (Jika requiredRoles diisi di halaman Dashboard)
            if (requiredRoles.length > 0) {
                // Pastikan role_id user ada di dalam list requiredRoles
                // Pastikan field di database Anda benar 'role_id' atau 'role'
                const userRole = user.role_id || user.role;

                if (!requiredRoles.includes(userRole)) {
                    alert('Anda tidak memiliki akses ke halaman ini.');
                    window.location.href = '/'; // Redirect jika user salah kamar
                    return;
                }
            }

            setIsAuthorized(true);
        } catch (error) {
            console.error('Error parsing user data', error);
            localStorage.clear();
            window.location.href = '/login';
        }
    }, [requiredRoles]); // Tambahkan dependency requiredRoles

    if (isAuthorized === null) {
        return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Memuat data...</div>;
    }

    return <>{children}</>;
};
