import { useNavigate } from 'react-router-dom';
import { LogOut, Droplet } from 'lucide-react';

export const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#03070b] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-md w-full bg-[#111928]/80 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,212,255,0.05)]">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                    <Droplet className="w-8 h-8 text-cyan-400" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-3 tracking-wide" style={{ textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>
                    Portal Ciudadano
                </h1>

                <p className="text-center text-cyan-100/60 mb-10 text-sm leading-relaxed">
                    Bienvenido a la red de <strong>Hidro-Reporte</strong>. Muy pronto podrás levantar incidencias, reportar fugas en tiempo real y visualizar el estatus hídrico de tu zona.
                </p>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0b101a] text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 hover:border-red-400 focus:outline-none transition-all Group"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-semibold tracking-wide uppercase">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};
