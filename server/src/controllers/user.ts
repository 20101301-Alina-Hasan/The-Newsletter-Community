import bcrypt from 'bcryptjs';
import { createSession } from '../utils/session';
import { Request, Response } from "express";
import { AuthRequest } from '../interfaces/auth';
import { Op } from 'sequelize';
import db from '../models';

// Mock User Object
// {
//     "name": "John Doe",
//     "username": "johndoe123",
//     "email": "john.doe@example.com",
//     "password": "securePassword123"
// }

// {
//     "name": "alina hasan",
//     "email": "alina.hasan@gmail.com",
//     "password":"abc@123",
//     "username": "aly.theia"
// }

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

        // Validate input
        if (!name || !username || !email || !password) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }
        // Check if user already exists
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await db.User.create({ name, username, email, password: hashedPassword });

        if (user) {
            // Create JWT session token
            const token = createSession(user.user_id);

            // Set the token as an HTTP-only cookie
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiry (1 month)
            });

            // Send response
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

        // Validate input
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }

        // Find user by email
        const user = await db.User.findOne({
            where: { email },
        });

        if (!user) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }

        // Create JWT session token
        const token = createSession(user.user_id);

        // Set the token as an HTTP-only cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiry (1 month)
        });

        // Send response
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