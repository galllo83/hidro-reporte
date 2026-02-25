import type { AuthResponse, LoginCredentials, User } from '../domain/auth.types';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authRepository = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            // 1. Authenticate and get JWT Token
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!loginRes.ok) {
                const errorData = await loginRes.json().catch(() => null);
                throw new Error(errorData?.message || 'Credenciales inválidas o error de servidor');
            }

            const { accessToken } = await loginRes.json();

            // Store token tentatively for the /me request
            localStorage.setItem('auth_token', accessToken);

            // 2. Fetch User Profile using the token
            const meRes = await fetch(`${API_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!meRes.ok) {
                localStorage.removeItem('auth_token'); // Cleanup if /me fails
                throw new Error('Error al obtener el perfil de usuario');
            }

            const user: User = await meRes.json();

            return {
                user,
                token: accessToken
            };
        } catch (error: any) {
            console.error("Auth Repository Error:", error);
            throw new Error(error.message || 'Error de red durante el inicio de sesión');
        }
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('auth_user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
};
