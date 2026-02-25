export interface User {
    id: string;
    email: string;
    role?: string; // Note: Ensure this matches the backend JWT structure.
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    address: {
        street: string;
        city: string;
        postalCode?: string;
    };
}
