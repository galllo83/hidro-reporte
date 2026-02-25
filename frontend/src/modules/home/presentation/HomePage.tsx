import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Droplet, Plus, MapPin, Hash, Trash2 } from 'lucide-react';
import { useWaterServices } from '../../water-service/application/useWaterServices';
import { RegisterServiceForm } from '../../water-service/presentation/components/RegisterServiceForm';

export const HomePage = () => {
    const navigate = useNavigate();
    const { services, isLoading, error, loadServices, addService, removeService } = useWaterServices();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadServices();
    }, [loadServices]);

    const handleLogout = () => {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#03070b] flex flex-col items-center py-12 px-4 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-[#111928]/80 backdrop-blur-xl border border-cyan-500/20 p-6 rounded-2xl shadow-[0_0_40px_rgba(0,212,255,0.05)]">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                            <Droplet className="w-7 h-7 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-wide" style={{ textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>
                                Portal Ciudadano
                            </h1>
                            <p className="text-cyan-100/60 text-sm">Hidro-Reporte Hidalgo</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0b101a] text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 hover:border-red-400 focus:outline-none transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-semibold tracking-wide uppercase">Cerrar Sesión</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="bg-[#111928]/60 backdrop-blur-md border border-gray-800 p-8 rounded-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                            Tus Cuentas Vinculadas
                        </h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5"
                        >
                            <Plus className="w-4 h-4" />
                            Vincular Cuenta
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {isLoading && services.length === 0 ? (
                        <div className="flex justify-center p-12">
                            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl bg-black/20">
                            <Droplet className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-400 mb-2">No tienes cuentas vinculadas</h3>
                            <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                Vincula tu cuenta de servicio de agua para poder visualizar estatus, reportar fugas e incidencias de manera rápida.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.map((service: any) => (
                                <div key={service.id} className="group relative bg-[#0b101a] border border-gray-800 hover:border-cyan-500/40 p-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                                    <button
                                        onClick={() => removeService(service.id)}
                                        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Eliminar vinculación"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                            <Hash className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">No. de Servicio</p>
                                            <p className="text-lg font-bold text-gray-200 font-mono tracking-wide">{service.serviceNumber}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-5 pt-5 border-t border-gray-800/80">
                                        <div className="flex items-start gap-3 text-gray-400">
                                            <MapPin className="w-4 h-4 mt-0.5 text-cyan-500/70" />
                                            <div className="text-sm">
                                                <p className="text-gray-300">{service.street}</p>
                                                <p className="text-gray-500">{service.neighborhood}, {service.city}</p>
                                                <p className="text-gray-500 tracking-wider">CP: {service.postalCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <RegisterServiceForm
                    onSubmit={addService}
                    onClose={() => setIsModalOpen(false)}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};
