import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { showToast } from '../utils/toast';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isEmailValid(email)) {
            showToast('error', 'Invalid email address.');
            setError('Invalid email address.');
            return;
        }

        try {
            const result = await loginUser(email, password);
            if (result) {
                showToast('success', 'Login successful! Redirecting...');
                navigate('/');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast('error', err.message);
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 bg-base-100 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-base-content">Login</h1>
                {error && <div className="text-error text-center mb-4">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm text-center mt-4 text-base-content">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-primary">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};