import { useState } from 'react';
import type { LoginCredentials, AuthResponse } from '../domain/auth.types';
import { authRepository } from '../infra/auth.repo';

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authRepository.login(credentials);
            setUser(response.user);

            // authRepository.login already handles token storage temporarily
            // We just need to persist the user object for UI purposes
            localStorage.setItem('auth_user', JSON.stringify(response.user));

            return response.user;
        } catch (err: any) {
            setError(err.message || 'Error occurred during login');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        authRepository.logout();
    };

    return {
        login,
        logout,
        isLoading,
        error,
        user
    };
};
