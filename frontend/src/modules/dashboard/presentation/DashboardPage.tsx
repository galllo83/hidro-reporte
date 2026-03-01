import { AdminLayout } from './components/AdminLayout';
import { InteractiveMap } from './components/InteractiveMap';
import { StatsChart } from './components/StatsChart';

export const DashboardPage = () => {
    return (
        <AdminLayout>
            <div className="w-full h-full p-6 flex flex-col gap-6 overflow-y-auto">
                {/* Map Container - Upper Half */}
                <div className="w-full min-h-[500px] sm:min-h-[400px] flex-shrink-0 relative">
                    <InteractiveMap />
                </div>

                {/* Stats Container - Lower Half */}
                <div className="w-full flex-1 min-h-[350px]">
                    <StatsChart />
                </div>
            </div>
        </AdminLayout>
    );
};
