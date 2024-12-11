import { Response, NextFunction } from 'express';
import { getSession } from '../utils/session';
import { AuthRequest } from '../interfaces/auth';

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers.authorization;

    if (!header) {
        res.status(401).json({ message: 'Unauthorized. Token is missing.' });
        return;
    }

    // Extract the token from the "Bearer <token>" format
    let token = header.split(' ')[1];

    // If not in header, check cookie
    if (!token) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.status(403).json({ message: 'Unauthorized. Token is missing.' });
        return;
    }

    try {
        const session = getSession(token)
        req.user = session;
        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
