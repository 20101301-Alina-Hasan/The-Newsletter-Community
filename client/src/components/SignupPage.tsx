import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';
import { showToast } from '../utils/toast';

export const SignupPage = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = (password: string) => password.length >= 8;
    const isUsernameValid = (username: string) => username.length >= 3;

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isEmailValid(email)) {
            showToast('error', 'Invalid email address.');
            setError('Invalid email address.');
            return;
        }

        if (!isPasswordValid(password)) {
            showToast('error', 'Password must be at least 8 characters long.');
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (!isUsernameValid(username)) {
            showToast('error', 'Username must be at least 3 characters long.');
            setError('Username must be at least 3 characters long.');
            return;
        }

        try {
            const result = await registerUser(name, username, email, password);
            if (result) {
                showToast('success', 'User registered successfully! Redirecting...');
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
                <h1 className="text-2xl font-bold text-center mb-6 text-base-content">Sign Up</h1>
                {error && <div className="text-error text-center mb-4">{error}</div>}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
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
                        Sign Up
                    </button>
                </form>
                <p className="text-sm text-center mt-4 text-base-content">
                    Already have an account?{' '}
                    <a href="/login" className="text-primary">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};
