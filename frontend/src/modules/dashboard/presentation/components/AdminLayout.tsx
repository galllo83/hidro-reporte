import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../../../auth/application/useLogin';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export const AdminLayout = ({ children, title = 'Gestión de Zonas', description = 'Dibuja y administra los polígonos de distribución de agua.' }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useLogin();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen w-full bg-[#03070b] overflow-hidden font-sans text-white">

            {/* Sidebar */}
            <aside className="w-[280px] h-full bg-[#0b101a]/95 border-r border-cyan-500/20 shadow-[4px_0_24px_rgba(0,0,0,0.5)] flex flex-col z-20">
                {/* Brand */}
                <div className="h-[72px] flex items-center px-6 border-b border-cyan-500/20 relative">
                    <div className="absolute inset-y-0 left-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 mr-3">
                        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                        <path d="M9 18v-4" strokeWidth="2" /><path d="M12 18v-7" strokeWidth="2" /><path d="M15 18v-3" strokeWidth="2" />
                    </svg>
                    <span className="font-semibold text-[16px] tracking-wide text-white" style={{ textShadow: '0 0 8px rgba(255,255,255,0.2)' }}>
                        Hidro-Reporte
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
                    <div className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 px-2">Menú Principal</div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`flex items-center w-full px-4 py-3 rounded-xl transition-all group ${location.pathname === '/dashboard' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span className="text-[14px] font-medium">Gestión de Zonas</span>
                    </button>

                    <button className="flex items-center w-full px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 border border-transparent transition-all group mt-2 opacity-50 cursor-not-allowed">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
                        <span className="text-[14px] font-medium">Usuarios</span>
                    </button>

                    <button
                        onClick={() => navigate('/dashboard/reports')}
                        className={`flex items-center w-full px-4 py-3 rounded-xl transition-all group mt-2 ${location.pathname === '/dashboard/reports' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span className="text-[14px] font-medium">Reportes Históricos</span>
                    </button>

                    <button
                        onClick={() => navigate('/dashboard/valves')}
                        className={`flex items-center w-full px-4 py-3 rounded-xl transition-all group mt-2 ${location.pathname === '/dashboard/valves' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span className="text-[14px] font-medium">Lista de Válvulas</span>
                    </button>
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-cyan-500/20">
                    <div className="flex items-center px-4 py-3 mb-4 rounded-xl bg-[#111928] border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-cyan-600/30 flex items-center justify-center border border-cyan-500/50 text-cyan-300 font-bold mr-3">
                            A
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-[13px] font-semibold truncate">{user?.email || 'Administrador'}</div>
                            <div className="text-[11px] text-cyan-400 capitalize">Rol: {user?.role || 'Admin'}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-[13px] font-medium"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full bg-[#050b14] relative">
                {/* Header Sub-bar */}
                <header className="h-[72px] bg-[#0b101a]/80 backdrop-blur-md border-b border-cyan-500/10 flex items-center justify-between px-8 z-10 shrink-0">
                    <div>
                        <h2 className="text-[18px] font-semibold text-white tracking-wide">{title}</h2>
                        <p className="text-[12px] text-white/50 mt-0.5">{description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-medium flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2 shadow-[0_0_5px_#22d3ee] animate-pulse"></span>
                            Sistema En Línea
                        </div>
                    </div>
                </header>

                {/* Dashboard Content Injection */}
                <div className="flex-1 overflow-hidden relative">
                    {children}
                </div>
            </main>
        </div>
    );
};
