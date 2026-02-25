import { AdminLayout } from './components/AdminLayout';
import { InteractiveMap } from './components/InteractiveMap';

export const DashboardPage = () => {
    return (
        <AdminLayout>
            <div className="w-full h-full p-6 flex flex-col">
                {/* Map Container */}
                <div className="flex-1 w-full relative">
                    <InteractiveMap />
                </div>
            </div>
        </AdminLayout>
    );
};
