import { Response, NextFunction } from 'express';
import { getSession } from '../utils/session';
import { AuthRequest } from '../interfaces/authInterface';

export const trackUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const header = req.headers.authorization;
    if (!header || header == undefined || header == "null" || header == "undefined" || header == null) {
        console.log("No header")
        next();
        return;
    } else {
        let token = header.split(' ')[1];
        if (!token || token === "null" || token === "undefined" || token === null || token === undefined) {
            console.log("No Token")
            next()
            return;
        }
        console.log("NEXT")
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
    }
};
