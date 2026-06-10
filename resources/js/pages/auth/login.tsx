import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, Mail } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign In — RPITS" />

            <div className="min-h-screen flex">
                {/* ── Left panel: branding ── */}
                <div
                    className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(145deg, #1a3a6b 0%, #0e2247 50%, #071529 100%)' }}
                >
                    {/* Decorative circles */}
                    <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-10"
                         style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
                    <div className="absolute bottom-[-60px] right-[-60px] w-56 h-56 rounded-full opacity-10"
                         style={{ background: 'radial-gradient(circle, #93c5fd, transparent)' }} />
                    <div className="absolute top-1/2 right-[-40px] w-40 h-40 rounded-full opacity-5"
                         style={{ background: 'radial-gradient(circle, #bfdbfe, transparent)' }} />

                    <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-md">
                        {/* Emblem / Logo */}
                        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 border-blue-400/30"
                             style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                            <img src="/logo.svg" alt="RPITS Logo" className="w-20 h-20 object-contain" />
                        </div>

                        {/* Org name in Khmer */}
                        <h1 className="text-white font-bold text-xl leading-relaxed mb-2"
                            style={{ fontFamily: 'Battambang, Khmer, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                            វិទ្យាស្ថានពហុបច្ចេកទេស
                        </h1>
                        <h1 className="text-white font-bold text-xl leading-relaxed mb-4"
                            style={{ fontFamily: 'Battambang, Khmer, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                            ភូមិភាគតេជោសែនស្វាយរៀង
                        </h1>
                        <div className="w-16 h-1 rounded-full bg-blue-400 mb-4 opacity-70" />
                        <p className="text-blue-200 text-sm font-medium tracking-widest uppercase">
                            Regional Polytechnic Institute
                        </p>
                        <p className="text-blue-300/70 text-xs tracking-wider mt-1">
                            Techo Sen Svay Rieng
                        </p>

                        {/* Feature bullets */}
                        <div className="mt-12 space-y-3 text-left w-full">
                            {[
                                'Manage articles & publications',
                                'Department & course management',
                                'E-library & thesis portal',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                                    <span className="text-blue-100/80 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right panel: form ── */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
                    <div className="w-full max-w-md">

                        {/* Mobile-only header */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center mx-auto mb-3">
                                <img src="/logo.svg" alt="RPITS Logo" className="w-10 h-10 object-contain" />
                            </div>
                            <p className="text-blue-900 font-bold text-sm leading-relaxed"
                               style={{ fontFamily: 'Battambang, Khmer, sans-serif' }}>
                                វិទ្យាស្ថានពហុបច្ចេកទេសភូមិភាគតេជោសែនស្វាយរៀង
                            </p>
                        </div>

                        {/* Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                                <p className="text-gray-500 text-sm mt-1">Sign in to your admin account to continue</p>
                            </div>

                            {status && (
                                <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                                            <Mail className="w-4 h-4" />
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="you@example.com"
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition
                                                ${errors.email
                                                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                                                    : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                }`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        {canResetPassword && (
                                            <a
                                                href={route('password.request')}
                                                tabIndex={5}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                                            >
                                                Forgot password?
                                            </a>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                                            <Lock className="w-4 h-4" />
                                        </span>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition
                                                ${errors.password
                                                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
                                                    : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember me */}
                                <div className="flex items-center gap-2">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        tabIndex={3}
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                                        Keep me signed in
                                    </label>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    tabIndex={4}
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold transition
                                               disabled:opacity-70 disabled:cursor-not-allowed"
                                    style={{ background: processing ? '#93aed4' : 'linear-gradient(135deg, #1e40af, #1d4ed8)' }}
                                >
                                    {processing ? (
                                        <><LoaderCircle className="w-4 h-4 animate-spin" /> Signing in…</>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-6">
                            © {new Date().getFullYear()} RPITS · All rights reserved
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
