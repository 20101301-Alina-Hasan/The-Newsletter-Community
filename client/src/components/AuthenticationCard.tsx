import { useState } from 'react';
import { SignupPage } from './SignupCard';
import { LoginPage } from './LoginCard';

export const AuthenticationCard = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 bg-base-100 rounded-lg shadow-md">
                {isLogin ? (
                    <LoginPage />
                ) : (
                    <SignupPage />
                )}
                <p className="text-sm text-center mt-4 text-base-content">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin((prevState) => !prevState)}
                        className="text-primary"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

