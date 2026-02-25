import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-4xl font-bold text-blue-400 mb-6">Inicio de Usuario</h1>
            <p className="text-lg text-slate-300 mb-8 max-w-md text-center">
                Bienvenido de nuevo a Hidro-Reporte. Aquí puedes ver tus reportes personales y métricas.
            </p>
            <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/40 transition-colors"
            >
                Cerrar Sesión
            </button>
        </div>
    );
};
