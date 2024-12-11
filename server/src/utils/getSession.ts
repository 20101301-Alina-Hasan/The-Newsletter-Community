import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'RANDOM_KEY';

export const getSession = (token: string) => {
    try {
        const session = jwt.verify(token, JWT_SECRET) as { expiresAt: number; userId: number };

        const currentTime = Date.now();
        if (session.expiresAt < currentTime) {
            throw new Error('Session expired. Please log in again.');
        }

        return session;
    } catch (err) {
        throw new Error('Invalid token or session expired.');
    }
};