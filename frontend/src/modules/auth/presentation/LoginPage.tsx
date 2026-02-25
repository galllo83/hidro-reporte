import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../application/useLogin';
import mockupBg from '../../../assets/mockup-bg.png';

export const LoginPage = () => {
    const { login, isLoading, error } = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = await login({ email, password });
        if (user) {
            console.log('Login successful! Redirecting...', user);
            if (user.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/home');
            }
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-[#03070b] overflow-hidden font-sans">

            {/* Background - Using the exact mockup with a dark overlay and blur so the aesthetic lines remain but the duplicate interface is hidden */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 blur-[12px] scale-105"
                style={{ backgroundImage: `url(${mockupBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#03070b]/60 to-[#03070b]/90 pointer-events-none" />

            {/* Main Glass Card */}
            <div className="relative z-10 w-full max-w-[400px] rounded-[16px] bg-gradient-to-b from-[#111928]/95 to-[#0b101a]/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] flex flex-col items-center px-8 py-10">

                {/* Specular Top Edge Glow */}
                <div className="absolute top-0 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_rgba(34,211,238,1)] opacity-80" />

                {/* Logo and Title */}
                <div className="flex items-center gap-3 mb-10 text-white mt-2">
                    <div className="relative flex items-center justify-center">
                        {/* Glowing orb behind logo */}
                        <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-40 rounded-full" />
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]">
                            {/* Drop */}
                            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                            {/* Chart */}
                            <path d="M9 18v-4" strokeWidth="2" />
                            <path d="M12 18v-7" strokeWidth="2" />
                            <path d="M15 18v-3" strokeWidth="2" />
                            {/* Arrow */}
                            <path d="M15 8h3v3" strokeWidth="2" />
                            <path d="M18 8l-5 5" strokeWidth="2" />
                        </svg>
                    </div>
                    <h1 className="text-[22px] font-semibold tracking-wide" style={{ textShadow: '0 0 10px rgba(255,255,255,0.4)' }}>
                        Hidro-Reporte
                    </h1>
                </div>

                {/* Welcome Text */}
                <h2 className="text-[14px] font-medium tracking-[0.1em] text-white/95 mb-8 uppercase">
                    Welcome Back
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                    {error && (
                        <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-cyan-400 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </div>
                        <input
                            type="email"
                            required
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[50px] bg-[#1a2333]/40 border-[1.5px] border-cyan-600/60 rounded-[10px] pl-11 pr-4 text-white text-[13px] placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:bg-[#1a2333]/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-cyan-400 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-[50px] bg-[#1a2333]/40 border-[1.5px] border-cyan-600/60 rounded-[10px] pl-11 pr-4 text-white text-[13px] placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:bg-[#1a2333]/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[50px] mt-1 rounded-[10px] text-[#020617] font-bold text-[13px] uppercase tracking-[0.05em] shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:shadow-[0_0_30px_rgba(0,212,255,0.7)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70"
                        style={{ background: 'linear-gradient(90deg, #00d2ff 0%, #00f0ff 100%)' }}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 flex flex-col items-center gap-5 text-[12px]">
                    <a href="#" className="text-white/70 hover:text-white transition-colors cursor-pointer">
                        Forgot Password?
                    </a>
                    <div className="text-white/50">
                        Don't have an account? <a href="#" className="text-white font-semibold hover:text-cyan-400 transition-colors cursor-pointer ml-1">Request Access.</a>
                    </div>
                </div>

            </div>
        </div>
    );
};
