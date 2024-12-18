/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { UserContext, UserContextType } from '../interfaces/userInterfaces';
import { showToast } from '../utils/toast';

export const SignupPage = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const { userDispatch } = useContext(UserContext) as UserContextType;

    const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = (password: string) => password.length >= 8;
    const isUsernameValid = (username: string) => username.length >= 3;

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = {
            name: '',
            username: '',
            email: '',
            password: '',
        };

        if (!name.trim()) newErrors.name = 'Name is required.';
        if (!isUsernameValid(username)) newErrors.username = 'Username must be at least 3 characters long.';
        if (!isEmailValid(email)) newErrors.email = 'Invalid email address.';
        if (!isPasswordValid(password)) newErrors.password = 'Password must be at least 8 characters long.';

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== '')) return;

        try {
            const result = await registerUser(name, username, email, password);
            if (result) {
                userDispatch({
                    type: 'login',
                    payload: {
                        token: result.token,
                        user: result.user,
                    },
                });
                showToast('success', 'User registered successfully!');
                navigate('/');
            }
        } catch (error: any) {
            showToast('error', `Error: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-16">
            <p className="text-2xl text-center text-base-content mb-14">
                <span className="text-3xl font-semibold">Want to share your thoughts?</span> <br />
                <span className="text-3xl text-accent font-extrabold">Join us now</span> and start posting your own articles. <br />
                Become a member of our community <br />
                in just a few minutes!
            </p>
            <div className="w-full max-w-md p-8 bg-base-100 rounded-lg shadow-md mb-16">
                <h1 className="text-2xl font-bold text-center mb-6 text-base-content">Sign Up</h1>
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
                            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                        />
                        {errors.name && <p className="text-error mt-2">{errors.name}</p>}
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
                            className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
                        />
                        {errors.username && <p className="text-error mt-2">{errors.username}</p>}
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
                            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                        />
                        {errors.email && <p className="text-error mt-2">{errors.email}</p>}
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
                            className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                        />
                        {errors.password && <p className="text-error mt-2">{errors.password}</p>}
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Sign Up
                    </button>
                </form>
                <p className="text-sm text-center mt-4 text-base-content">
                    Already have an account?
                    <button
                        onClick={() => navigate('/login')}
                        className="text-primary ml-2"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};



