import bcrypt from 'bcryptjs';
import { createSession } from '../utils/session';
import { Request, Response } from "express";
import { AuthRequest } from '../interfaces/authInterface';
import { Op } from 'sequelize';
import db from '../models';

export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        const user_id = req.user.userId;

        if (!user_id) {
            res.status(400).json({ message: 'User ID is required.' });
            return;
        }

        const user = await db.User.findByPk(user_id, {
            attributes: ['user_id', 'name', 'username', 'email'],
        });

        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        res.status(200).json({
            message: 'User retrieved successfully.',
            user
        });

        console.log("sending data...")
        return;
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
        return;
    }
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }
        const existingUser = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { username },
                ],
            },
        });
        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Username';
            res.status(400).json({ message: `${field} already registered.` });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(name, username, email, hashedPassword)
        const user = await db.User.create({ name, username, email, password: hashedPassword });

        if (user) {
            const token = createSession(user.user_id);
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            res.status(201).json({
                message: 'User registered successfully!',
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                },
                token,
            });
            return;
        } else {
            res.status(409).json({ message: "Invalid user details." });
            return;
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error during registration:', error.message);
            res.status(500).json({ message: 'Server error. Please try again later.' });
            return;
        }

        console.error('Unknown error during registration:', error);
        res.status(500).json({ message: 'An unknown error occurred.' });
        return;
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }
        const user = await db.User.findOne({
            where: { email },
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }
        const token = createSession(user.user_id);
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
        return;
    }
};