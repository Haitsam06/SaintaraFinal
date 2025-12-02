import { FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface ResetPasswordProps {
    email: string | null;
    status?: string;
}

export default function ResetPassword({ email, status }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: email ?? '',
        otp: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <AuthLayout
            title="Reset password"
            description="Masukkan kode OTP yang dikirim ke email Anda dan buat password baru."
        >
            <Head title="Reset password" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label
                        htmlFor="email"
                        className="text-gray-900 font-medium"
                    >
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        readOnly
                        className="text-gray-900 bg-gray-100"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label
                        htmlFor="otp"
                        className="text-gray-900 font-medium"
                    >
                        Kode OTP
                    </Label>
                    <Input
                        id="otp"
                        type="text"
                        name="otp"
                        inputMode="numeric"
                        maxLength={6}
                        value={data.otp}
                        onChange={(e) => setData('otp', e.target.value)}
                        className="text-gray-900"
                        placeholder="Masukkan 6 digit kode"
                        autoFocus
                        required
                    />
                    <InputError message={errors.otp} />
                </div>

                <div className="grid gap-2">
                    <Label
                        htmlFor="password"
                        className="text-gray-900 font-medium"
                    >
                        Password baru
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        className="text-gray-900"
                        placeholder="Password baru"
                        required
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <Label
                        htmlFor="password_confirmation"
                        className="text-gray-900 font-medium"
                    >
                        Konfirmasi password
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        autoComplete="new-password"
                        className="text-gray-900"
                        placeholder="Ulangi password baru"
                        required
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <Button
                    type="submit"
                    className="mt-2 w-full bg-saintara-black text-white font-bold"
                    disabled={processing}
                >
                    {processing ? 'Memproses...' : 'Reset password'}
                </Button>

                <div className="mt-4 text-center text-sm text-gray-900">
                    <span>Kembali ke </span>
                    <Link
                        href="/login"
                        className="font-bold text-yellow-600 hover:underline"
                    >
                        login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
