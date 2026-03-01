import { AdminLayout } from './components/AdminLayout';
import { InteractiveMap } from './components/InteractiveMap';

export const DashboardPage = () => {
    return (
        <AdminLayout title="Gestión de Zonas" description="Dibuja y administra los polígonos de distribución de agua.">
            <div className="w-full h-full p-6 flex flex-col">
                <div className="flex-1 w-full relative">
                    <InteractiveMap />
                </div>
            </div>
        </AdminLayout>
    );
};
