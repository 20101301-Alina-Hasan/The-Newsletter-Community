import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { showToast } from '../utils/toast';
import { UserContext, UserContextType } from '../interfaces/userInterfaces';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { userDispatch } = useContext(UserContext) as UserContextType;

    const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isEmailValid(email)) {
            setError('Invalid email address.');
            return;
        }

        try {
            const result = await loginUser(email, password);
            if (result) {
                // Dispatch user data to update the state
                userDispatch({
                    type: 'login',
                    payload: {
                        token: result.token,
                        user: result.user, // Assuming `result.user` contains the user details
                    },
                });
                showToast('success', 'Logged in successfully!');
                navigate('/');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast('error', err.message);
            setError(err.message);
        }
    };

    return (
        <div>
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
        </div>
    );
};