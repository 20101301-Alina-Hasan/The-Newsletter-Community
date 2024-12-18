import { Request } from "express";

export interface AuthRequest extends Request {
    headers: any;
    cookies: any;
    user?: any;
}