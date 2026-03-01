import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserReports } from '../application/useUserReports';
import { ArrowLeft, Calendar, Filter, Droplet, MapPin } from 'lucide-react';

export const MyReportsPage = () => {
    const navigate = useNavigate();
    const { reports, isLoading, error, fetchReports } = useUserReports();
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        fetchReports({
            day: day ? parseInt(day) : undefined,
            month: month ? parseInt(month) : undefined,
            year: year ? parseInt(year) : undefined,
        });
    }, [day, month, year, fetchReports]);

    const getReportIcon = (type: string) => {
        switch (type) {
            case 'SUPPLY_RESTORED': return <Droplet fill="currentColor" className="w-6 h-6 text-cyan-400" />;
            case 'SUPPLY_ENDED': return <Droplet fill="currentColor" className="w-6 h-6 text-red-500" />;
            case 'LEAK_REPORTED': return (
                <div className="relative">
                    <Droplet fill="currentColor" className="w-6 h-6 text-yellow-500" />
                    <div className="absolute top-1/2 left-1/2 w-8 h-[2px] bg-red-500 -translate-x-1/2 -translate-y-1/2 rotate-45 transform origin-center shadow-sm" />
                </div>
            );
            default: return <Droplet fill="currentColor" className="w-6 h-6" />;
        }
    };

    const getReportLabel = (type: string) => {
        switch (type) {
            case 'SUPPLY_RESTORED': return 'Llegó el Agua';
            case 'SUPPLY_ENDED': return 'Se Fue el Agua';
            case 'LEAK_REPORTED': return 'Reporte de Fuga';
            default: return 'Reporte';
        }
    };

    const getReportColorClass = (type: string) => {
        switch (type) {
            case 'SUPPLY_RESTORED': return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
            case 'SUPPLY_ENDED': return 'bg-red-500/10 border-red-500/30 text-red-400';
            case 'LEAK_REPORTED': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
            default: return 'bg-gray-800 border-gray-700 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-[#03070b] flex flex-col items-center py-12 px-4 relative overflow-hidden font-sans">
            <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="p-3 bg-[#111928]/80 text-gray-300 hover:text-white rounded-xl border border-gray-800 hover:border-gray-600 transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-wide" style={{ textShadow: '0 0 15px rgba(255,255,255,0.2)' }}>
                            Mis Reportes
                        </h1>
                        <p className="text-cyan-100/60 text-sm">Historial de contribuciones</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-[#111928]/80 backdrop-blur-xl border border-cyan-500/20 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-[0_0_30px_rgba(34,211,238,0.05)]">
                    <div className="flex items-center gap-2 text-cyan-400 w-full md:w-auto font-semibold">
                        <Filter className="w-5 h-5" /> Filtros:
                    </div>
                    <div className="flex flex-1 gap-4 w-full md:w-auto">
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="flex-1 bg-black/40 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 outline-none transition-colors"
                        >
                            <option value="">Día</option>
                            {[...Array(31)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>

                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="flex-1 bg-black/40 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 outline-none transition-colors"
                        >
                            <option value="">Mes</option>
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>

                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="flex-1 bg-black/40 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 outline-none transition-colors"
                        >
                            <option value="">Año</option>
                            {[2024, 2025, 2026, 2027].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* List */}
                <div className="bg-[#111928]/60 backdrop-blur-md border border-gray-800 p-8 rounded-2xl min-h-[400px]">
                    {error && (
                        <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center transform animate-[slideUp_0.3s_ease-out]">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-2xl bg-black/20 animate-[fadeIn_0.5s_ease-out]">
                            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-400 mb-2">No hay reportes</h3>
                            <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                No se encontraron reportes con los filtros seleccionados.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {reports.map((report) => (
                                <div key={report.id} className="bg-[#0b101a] border border-gray-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gray-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] animate-[slideUp_0.4s_ease-out]">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getReportColorClass(report.type)}`}>
                                            {getReportIcon(report.type)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-200">{getReportLabel(report.type)}</h3>
                                            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                                <Calendar className="w-3.5 h-3.5 text-gray-600" />
                                                {new Date(report.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400 flex items-start gap-2 bg-black/30 p-3 rounded-xl w-full sm:w-auto border border-gray-800/50">
                                        <MapPin className="w-4 h-4 text-cyan-500/70 shrink-0 mt-0.5" />
                                        <div>
                                            {report.address ? (
                                                <>
                                                    <p className="font-medium text-gray-300">{report.address.street || 'Calle desconocida'}</p>
                                                    <p className="text-xs mt-0.5 text-gray-500">{report.address.neighborhood || ''} {report.address.postalCode ? `CP: ${report.address.postalCode}` : ''}</p>
                                                </>
                                            ) : (
                                                <p className="font-mono text-xs text-gray-500">
                                                    Lat: {report.location.lat.toFixed(5)}<br />
                                                    Lng: {report.location.lng.toFixed(5)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
