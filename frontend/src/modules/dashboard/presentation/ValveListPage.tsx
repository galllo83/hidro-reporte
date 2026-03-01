import { useEffect, useState, useMemo } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { useZones } from '../application/useZones';
import type { Zone } from '../application/useZones';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Droplets } from 'lucide-react';

type SortField = 'name' | 'status' | 'createdAt';
type SortDir = 'asc' | 'desc';

const StatusBadge = ({ status }: { status?: string }) => {
    if (status === 'WATER_FLOWING') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa] animate-pulse" />
                Con Agua
            </span>
        );
    }
    if (status === 'NO_WATER') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-300 border border-red-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_6px_#f87171]" />
                Sin Agua
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-700/50 text-gray-400 border border-gray-600/50">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            Desconocido
        </span>
    );
};

const SortIcon = ({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />;
    return sortDir === 'asc'
        ? <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
        : <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />;
};

export const ValveListPage = () => {
    const { zones, fetchZones, isLoading } = useZones();
    const [nameSearch, setNameSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDir, setSortDir] = useState<SortDir>('asc');

    useEffect(() => {
        fetchZones();
    }, [fetchZones]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const filteredAndSorted = useMemo(() => {
        let result = [...zones];

        // Filter by name
        if (nameSearch.trim()) {
            result = result.filter(z =>
                z.name.toLowerCase().includes(nameSearch.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'ALL') {
            result = result.filter(z => (z.status || 'UNKNOWN') === statusFilter);
        }

        // Sort
        result.sort((a: Zone, b: Zone) => {
            let valA = '';
            let valB = '';
            if (sortField === 'name') {
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
            } else if (sortField === 'status') {
                valA = a.status || 'ZZZ';
                valB = b.status || 'ZZZ';
            } else if (sortField === 'createdAt') {
                valA = a.updatedAt;
                valB = b.updatedAt;
            }
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [zones, nameSearch, statusFilter, sortField, sortDir]);

    return (
        <AdminLayout title="Lista de Válvulas" description="Vista tabular del estado de todos los polígonos de distribución.">
            <div className="w-full h-full p-6 flex flex-col gap-4 overflow-auto">

                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Name Search */}
                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={nameSearch}
                            onChange={e => setNameSearch(e.target.value)}
                            className="bg-[#111928] border border-gray-700 text-gray-300 text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-9 px-3 py-2.5 outline-none transition-colors"
                        />
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative w-full sm:w-48">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="appearance-none bg-[#111928] border border-gray-700 text-gray-300 text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full px-3 py-2.5 pr-8 outline-none"
                        >
                            <option value="ALL">Todos los estados</option>
                            <option value="WATER_FLOWING">Con Agua</option>
                            <option value="NO_WATER">Sin Agua</option>
                            <option value="UNKNOWN">Desconocido</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>

                    <div className="ml-auto text-sm text-gray-500">
                        {filteredAndSorted.length} de {zones.length} polígonos
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#111928]/60 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] flex-1">
                    <div className="overflow-x-auto h-full">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800 bg-[#0b101a]/60">
                                <tr>
                                    <th className="px-6 py-4 w-12">#</th>
                                    <th className="px-6 py-4">
                                        <button
                                            onClick={() => handleSort('name')}
                                            className="flex items-center gap-2 hover:text-cyan-400 transition-colors font-semibold"
                                        >
                                            Nombre
                                            <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                                        </button>
                                    </th>
                                    <th className="px-6 py-4">
                                        <button
                                            onClick={() => handleSort('status')}
                                            className="flex items-center gap-2 hover:text-cyan-400 transition-colors font-semibold"
                                        >
                                            Estado
                                            <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                                        </button>
                                    </th>
                                    <th className="px-6 py-4">
                                        <button
                                            onClick={() => handleSort('createdAt')}
                                            className="flex items-center gap-2 hover:text-cyan-400 transition-colors font-semibold"
                                        >
                                            Actualizado
                                            <SortIcon field="createdAt" sortField={sortField} sortDir={sortDir} />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-500">
                                                <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                                                <span className="text-sm">Cargando polígonos...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredAndSorted.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-500">
                                                <Droplets className="w-10 h-10 text-gray-700" />
                                                <span className="text-sm">No se encontraron polígonos con esos filtros</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAndSorted.map((zone, idx) => (
                                        <tr
                                            key={zone.id}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="px-6 py-4 text-gray-600 text-xs font-mono">{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${zone.status === 'WATER_FLOWING' ? 'bg-blue-400 shadow-[0_0_6px_#60a5fa] animate-pulse' : zone.status === 'NO_WATER' ? 'bg-red-400' : 'bg-gray-600'}`} />
                                                    <span className="font-medium text-gray-200 group-hover:text-white transition-colors">{zone.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={zone.status} />
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                                                {new Date(zone.updatedAt).toLocaleDateString('es-MX', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
