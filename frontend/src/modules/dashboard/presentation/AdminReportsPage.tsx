import { AdminLayout } from './components/AdminLayout';
import { StatsChart } from './components/StatsChart';

export const AdminReportsPage = () => {
    return (
        <AdminLayout title="Reportes Históricos" description="Analiza las estadísticas y el historial de reportes.">
            <div className="w-full h-full p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="w-full min-h-[400px]">
                    <StatsChart />
                </div>
            </div>
        </AdminLayout>
    );
};
