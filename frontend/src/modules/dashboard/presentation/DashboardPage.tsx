import { AdminLayout } from './components/AdminLayout';

export const DashboardPage = () => {
    return (
        <AdminLayout>
            <div className="w-full h-full p-6 flex flex-col">
                {/* Temporary Placeholder for Map */}
                <div className="flex-1 w-full rounded-2xl border border-cyan-500/20 bg-[#0b101a]/50 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                    {/* Grid Pattern Background */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    <div className="flex flex-col items-center text-center z-10">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500/50 mb-4"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                        <h3 className="text-lg font-medium text-white/70">Módulo de Mapeo</h3>
                        <p className="text-sm text-white/40 mt-1">El componente del mapa interactivo (Leaflet) se renderizará aquí pronto.</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
