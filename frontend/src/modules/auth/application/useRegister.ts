import { useState } from 'react';
import type { RegisterCredentials, AuthResponse } from '../domain/auth.types';
import { authRepository } from '../infra/auth.repo';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);

    const register = async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authRepository.register(credentials);
            setUser(response.user);

            // Persist the user object natively after successful registration
            localStorage.setItem('auth_user', JSON.stringify(response.user));

            return response.user;
        } catch (err: unknown) {
            const typedErr = err as Error & { status?: number };
            let msg: string;
            if (typedErr.status === 409) {
                msg = 'El correo ya está registrado. Intenta con otro.';
            } else {
                msg = typedErr.message || 'Error de conexión con el servidor. Por favor, intenta de nuevo más tarde.';
            }
            setError(msg);
            throw typedErr;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        isLoading,
        error,
        user
    };
};
