import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../application/useRegister';
import mockupBg from '../../../assets/images/mockup-bg.png';

export const RegisterPage = () => {
    const { register, isLoading, error } = useRegister();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = await register({
            name,
            email,
            password,
            address: {
                street,
                city,
                postalCode
            }
        });

        if (user) {
            console.log('Registration successful! Redirecting...', user);
            // After successful registration, route to /home for citizens
            navigate('/home');
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-[#03070b] overflow-hidden font-sans">

            {/* Background - Using the exact mockup with a dark overlay and blur */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 blur-[12px] scale-105"
                style={{ backgroundImage: `url(${mockupBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#03070b]/60 to-[#03070b]/90 pointer-events-none" />

            {/* Main Glass Card */}
            <div className="relative z-10 w-full max-w-[450px] mx-4 rounded-[16px] bg-gradient-to-b from-[#111928]/95 to-[#0b101a]/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,212,255,0.15)] flex flex-col items-center px-6 sm:px-8 py-8 sm:py-10 my-8">

                {/* Specular Top Edge Glow */}
                <div className="absolute top-0 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_rgba(34,211,238,1)] opacity-80" />

                {/* Logo and Title */}
                <div className="flex items-center gap-3 mb-6 text-white mt-2">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-40 rounded-full" />
                        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <line x1="19" y1="8" x2="19" y2="14" />
                            <line x1="22" y1="11" x2="16" y2="11" />
                        </svg>
                    </div>
                    <h1 className="text-[20px] font-semibold tracking-wide" style={{ textShadow: '0 0 10px rgba(255,255,255,0.4)' }}>
                        Alta Ciudadana
                    </h1>
                </div>

                {/* Welcome Text */}
                <h2 className="text-[13px] font-medium tracking-[0.08em] text-cyan-200/80 mb-6 uppercase text-center">
                    Reporta incidentes de agua en tiempo real
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Name Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-cyan-400 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                        <input
                            type="text"
                            required
                            placeholder="Nombre Completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-[45px] bg-[#1a2333]/40 border-[1.5px] border-cyan-600/60 rounded-[10px] pl-11 pr-4 text-white text-[13px] placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:bg-[#1a2333]/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-cyan-400 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </div>
                        <input
                            type="email"
                            required
                            placeholder="Correo Electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[45px] bg-[#1a2333]/40 border-[1.5px] border-cyan-600/60 rounded-[10px] pl-11 pr-4 text-white text-[13px] placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:bg-[#1a2333]/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-cyan-400 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-[45px] bg-[#1a2333]/40 border-[1.5px] border-cyan-600/60 rounded-[10px] pl-11 pr-4 text-white text-[13px] placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:bg-[#1a2333]/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                        />
                    </div>

                    <div className="h-[1px] w-full bg-cyan-500/20 my-2" />

                    {/* Street Input */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-cyan-400 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        </div>
                        <input
                            type="text"
                            required
                            placeholder="Dirección (Calle y Número)"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="w-full h-[45px] bg-[#1a2333]/40 border-[1.5px] border-cyan-600/60 rounded-[10px] pl-11 pr-4 text-white text-[13px] placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:bg-[#1a2333]/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                        />
                    </div>

                    <div className="flex gap-4">
                        {/* City Input */}
                        <div className="relative group flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 group-focus-within:text-cyan-400 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" /></svg>
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="Colonia/Ciudad"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full h-[45px] bg-[#1a2333]/40 border-[1.5px] border-cyan-600/60 rounded-[10px] pl-11 pr-4 text-white text-[13px] placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:bg-[#1a2333]/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                            />
                        </div>

                        {/* Postal Code Input */}
                        <div className="relative group w-[100px]">
                            <input
                                type="text"
                                placeholder="C.P."
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                className="w-full h-[45px] bg-[#1a2333]/40 border-[1.5px] border-cyan-600/60 rounded-[10px] px-4 text-white text-[13px] placeholder:text-white/40 focus:outline-none focus:border-cyan-400 focus:bg-[#1a2333]/60 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all text-center"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[50px] mt-4 rounded-[10px] text-[#020617] font-bold text-[13px] uppercase tracking-[0.05em] shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:shadow-[0_0_30px_rgba(0,212,255,0.7)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70"
                        style={{ background: 'linear-gradient(90deg, #00d2ff 0%, #00f0ff 100%)' }}
                    >
                        {isLoading ? 'Registrando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 flex flex-col items-center gap-5 text-[12px]">
                    <div className="text-white/50">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-white font-semibold hover:text-cyan-400 transition-colors cursor-pointer ml-1">Inicia sesión aquí.</Link>
                    </div>
                </div>

            </div>
        </div>
    );
};
