import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-4xl font-bold text-cyan-400 mb-6">Admin Dashboard</h1>
            <p className="text-lg text-slate-300 mb-8 max-w-md text-center">
                Welcome to the Hidro-Reporte administrative control panel. Here you can manage system configurations and view broad statistics.
            </p>
            <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/40 transition-colors"
            >
                Sign Out
            </button>
        </div>
    );
};
