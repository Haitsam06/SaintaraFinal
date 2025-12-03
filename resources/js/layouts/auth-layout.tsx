import { PropsWithChildren, ReactNode } from 'react';

interface AuthLayoutProps {
    title: string;
    description?: string;
    children: ReactNode;
}

export default function AuthLayout({ title, description, children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-saintara-yellow p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="mb-4 flex justify-center">
                        <img
                            src="/assets/logo/5.png"
                            alt="Saintara Logo"
                            className="h-16 w-16"
                        />
                    </div>

                    {/* PAKSA HITAM */}
                    <h1 className="text-2xl font-bold !text-black !opacity-100">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-2 text-sm text-gray-700">
                            {description}
                        </p>
                    )}
                </div>

                {/* Content */}
                {children}
            </div>
        </div>
    );
}
