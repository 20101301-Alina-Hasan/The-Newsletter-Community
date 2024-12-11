import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/auth";
import db from "../models";

// Get all upvotes of an article
export const getUpvotes = async (req: Request, res: Response) => {
    const { news_id } = req.params;

    if (!news_id) {
        res.status(400).json({ message: "News ID is required." });
        return;
    }

    try {
        const upvotesCount = await db.Upvote.count({
            where: { news_id },
        });

        res.status(200).json({ news_id, upvotesCount });
    } catch (error) {
        console.error("Error fetching upvotes:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get user upvote on an article
export const getUserUpvotes = async (req: AuthRequest, res: Response) => {
    const { news_id } = req.params;
    const user_id = req.user.userId;

    if (!news_id || !user_id) {
        res.status(400).json({ message: "News ID and User ID are required." });
        return;
    }

    try {
        const userUpvote = await db.Upvote.findOne({
            where: { news_id, user_id },
        });

        // res.status(200).json({ upvote: userUpvote });
        res.status(200).json({ hasUpvoted: !!userUpvote });
        return;
    } catch (error) {
        console.error("Error fetching user upvote:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

// Add user upvote
export const addUpvote = async (req: AuthRequest, res: Response) => {
    const { news_id } = req.params;
    const user_id = req.user.userId;

    if (!news_id || !user_id) {
        res.status(400).json({ message: "News ID and User ID are required." });
        return;
    }

    try {
        // Check if upvote already exists
        const existingUpvote = await db.Upvote.findOne({
            where: { news_id, user_id },
        });

        if (existingUpvote) {
            res.status(400).json({ message: "User has already upvoted this news." });
            return;
        }

        const newUpvote = await db.Upvote.create({
            news_id,
            user_id,
        });

        res.status(201).json({ message: "User upvoted successfully.", upvote: newUpvote });
    } catch (error) {
        console.error("Error adding upvote:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Delete user upvote
export const removeUpvote = async (req: AuthRequest, res: Response) => {
    const { news_id } = req.params;
    const user_id = req.user.userId;

    if (!news_id || !user_id) {
        res.status(400).json({ message: "News ID and User ID are required." });
        return;
    }

    try {
        // Find the upvote
        const upvote = await db.Upvote.findOne({
            where: { news_id, user_id },
        });

        if (!upvote) {
            res.status(404).json({ message: "User did not upvote this news." });
            return;
        }

        await upvote.destroy();

        res.status(200).json({ message: "User upvote removed successfully." });
    } catch (error) {
        console.error("Error removing upvote:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

