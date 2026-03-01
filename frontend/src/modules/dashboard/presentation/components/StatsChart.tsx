import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useReportStats } from '../../../report/application/useReportStats';
import { useEffect } from 'react';
import { BarChart3 } from 'lucide-react';

export const StatsChart = () => {
    const { stats, isLoading, error, fetchStats } = useReportStats();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                Error al cargar estadísticas: {error}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#111928]/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6">
                <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!stats || stats.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#111928]/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 text-gray-400">
                <BarChart3 className="w-10 h-10 mb-3 text-gray-600" />
                <p>No hay datos suficientes para graficar</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#111928]/60 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Reportes por Colonia
            </h3>
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={stats}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        {/* 
                          We use dark theme colors that fit the app.
                          SUPPLY_RESTORED: cyan
                          SUPPLY_ENDED: red
                          LEAK_REPORTED: yellow
                        */}
                        <XAxis dataKey="neighborhood" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                            contentStyle={{ backgroundColor: '#111928', borderColor: '#374151', borderRadius: '12px', color: '#f3f4f6' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar name="Llegó el Agua" dataKey="SUPPLY_RESTORED" stackId="a" fill="#06b6d4" radius={[0, 0, 4, 4]} />
                        <Bar name="Se Fue el Agua" dataKey="SUPPLY_ENDED" stackId="a" fill="#ef4444" />
                        <Bar name="Fuga de Agua" dataKey="LEAK_REPORTED" stackId="a" fill="#eab308" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
