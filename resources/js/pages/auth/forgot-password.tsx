import { FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Route menuju PasswordResetController@sendCode
        post('/forgot-password');
    };

    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email to receive a password reset code"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-2">
                    <Label
                        htmlFor="email"
                        className="text-gray-900 font-medium"
                    >
                        Email address
                    </Label>

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="text-gray-900 placeholder:text-gray-400"
                        placeholder="email@example.com"
                        autoFocus
                    />

                    <InputError message={errors.email} />
                </div>

                <div>
                    <Button
                        disabled={processing}
                        className="w-full bg-saintara-black text-white font-bold py-2"
                    >
                        {processing ? 'Processing...' : 'Send reset code'}
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center text-gray-900 text-sm">
                <span>Or, return to </span>
                <Link
                    href="/login"
                    className="font-bold text-yellow-600 hover:underline"
                >
                    login
                </Link>
            </div>
        </AuthLayout>
    );
}
