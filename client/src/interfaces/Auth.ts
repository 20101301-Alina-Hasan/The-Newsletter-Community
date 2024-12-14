export interface AuthProps {
    // authenticated: boolean;
    login(cb: () => void): void;
    logout(cb: () => void): void;
    isAuthenticated(): boolean;
}