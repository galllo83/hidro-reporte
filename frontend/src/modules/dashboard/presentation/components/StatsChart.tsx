import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useReportStats } from '../../../report/application/useReportStats';
import { useZones } from '../../application/useZones';
import { useEffect, useState, useRef } from 'react';
import { BarChart3, Search, ChevronDown } from 'lucide-react';

export const StatsChart = () => {
    // Default to today
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

    // Search by Zone Name
    const [zoneNameInput, setZoneNameInput] = useState('');
    const [debouncedZoneName, setDebouncedZoneName] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { stats, isLoading, error, fetchStats } = useReportStats();
    const { zones, fetchZones } = useZones();

    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedZoneName(zoneNameInput);
        }, 500);
        return () => clearTimeout(handler);
    }, [zoneNameInput]);

    useEffect(() => {
        fetchZones();
    }, [fetchZones]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchStats({
            day: selectedDay || undefined,
            month: selectedMonth || undefined,
            year: selectedYear || undefined,
            zoneName: debouncedZoneName || undefined
        });
    }, [fetchStats, selectedDay, selectedMonth, selectedYear, debouncedZoneName]);

    return (
        <div className="w-full h-full bg-[#111928]/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Reportes por Polígono
                </h3>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {/* Searchable Dropdown by Polygon Name */}
                    <div className="relative w-full sm:w-56" ref={dropdownRef}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar polígono..."
                            value={zoneNameInput}
                            onChange={(e) => {
                                setZoneNameInput(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            className="bg-[#1f2937] border border-gray-700 text-gray-300 text-xs rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-9 pr-9 px-3 py-2 outline-none transition-colors"
                        />
                        <div
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute z-50 mt-1 w-full bg-[#1f2937] border border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                                <div
                                    className="px-3 py-2 text-xs text-gray-300 hover:bg-[#374151] cursor-pointer"
                                    onClick={() => {
                                        setZoneNameInput('');
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    Todos los polígonos
                                </div>
                                {zones
                                    .filter(z => z.name.toLowerCase().includes(zoneNameInput.toLowerCase()))
                                    .map(zone => (
                                        <div
                                            key={zone.id}
                                            className="px-3 py-2 text-xs text-gray-300 hover:bg-[#374151] cursor-pointer"
                                            onClick={() => {
                                                setZoneNameInput(zone.name);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            {zone.name}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Date Filters */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(Number(e.target.value))}
                                className="appearance-none bg-[#1f2937] border border-gray-700 text-gray-300 text-xs rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full px-3 py-2 pr-8"
                            >
                                <option value={0}>Día (Todos)</option>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="appearance-none bg-[#1f2937] border border-gray-700 text-gray-300 text-xs rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full px-3 py-2 pr-8"
                            >
                                <option value={0}>Mes (Todos)</option>
                                <option value={1}>Enero</option>
                                <option value={2}>Febrero</option>
                                <option value={3}>Marzo</option>
                                <option value={4}>Abril</option>
                                <option value={5}>Mayo</option>
                                <option value={6}>Junio</option>
                                <option value={7}>Julio</option>
                                <option value={8}>Agosto</option>
                                <option value={9}>Septiembre</option>
                                <option value={10}>Octubre</option>
                                <option value={11}>Noviembre</option>
                                <option value={12}>Diciembre</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="appearance-none bg-[#1f2937] border border-gray-700 text-gray-300 text-xs rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full px-3 py-2 pr-8"
                            >
                                <option value={0}>Año (Todos)</option>
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 w-full min-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="w-full h-full flex items-center justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                        Error al cargar estadísticas: {error}
                    </div>
                ) : !stats || stats.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <BarChart3 className="w-10 h-10 mb-3 text-gray-600" />
                        <p>No hay datos suficientes para graficar</p>
                    </div>
                ) : (
                    <div style={{ height: `${Math.max(300, stats.length * 60)}px`, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                            >
                                <XAxis type="number" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis type="category" dataKey="neighborhood" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} width={120} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                    contentStyle={{ backgroundColor: '#111928', borderColor: '#374151', borderRadius: '12px', color: '#f3f4f6' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar name="Llegó el Agua" dataKey="SUPPLY_RESTORED" stackId="a" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                                <Bar name="Se Fue el Agua" dataKey="SUPPLY_ENDED" stackId="a" fill="#ef4444" />
                                <Bar name="Fuga de Agua" dataKey="LEAK_REPORTED" stackId="a" fill="#eab308" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};
