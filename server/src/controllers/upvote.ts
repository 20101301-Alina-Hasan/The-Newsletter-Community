import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/auth";
import db from "../models";

// Get all comments on a news article
export const getUpvotes = async (req: Request, res: Response) => {
    const { news_id } = req.params;

    if (!news_id) {
        res.status(400).json({ message: 'News ID is required.' });
        return;
    }

    try {
        const comments = await db.Comment.findAll({
            where: { news_id },
            include: [{ model: db.User, attributes: ['username'] }], // Include user info (username)
            order: [['created_at', 'ASC']], // Order by creation date
        });

        if (!comments || comments.length === 0) {
            res.status(404).json({ message: 'No comments found for this news article.' });
            return;
        }

        res.status(200).json({ comments });
        return;
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error.' });
        return;
    }
};

// 
export const getUserUpvotes = async (req: AuthRequest, res: Response) => {
    const { news_id } = req.params;
    const { comment } = req.body;

    if (!news_id || !comment) {
        res.status(400).json({ message: 'News ID and comment text are required.' });
        return;
    }

    try {
        const newComment = await db.Comment.create({
            user_id: req.user.userId, // Get user ID from the token
            news_id,
            comment,
        });

        res.status(201).json({ message: 'Comment added successfully.', comment: newComment });
        return;
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error.' });
        return;
    }
};

// Add a comment to a news article
export const addUpvote = async (req: AuthRequest, res: Response) => {
    const { news_id } = req.params;
    const { comment } = req.body;

    if (!news_id || !comment) {
        res.status(400).json({ message: 'News ID and comment text are required.' });
        return;
    }

    try {
        const newComment = await db.Comment.create({
            user_id: req.user.userId, // Get user ID from the token
            news_id,
            comment,
        });

        res.status(201).json({ message: 'Comment added successfully.', comment: newComment });
        return;
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error.' });
        return;
    }
};

// Update a comment
export const deleteUpvote = async (req: AuthRequest, res: Response) => {
    const { comment_id } = req.params;

    try {
        const existingComment = await db.Comment.findOne({ where: { comment_id } });

        if (!existingComment) {
            res.status(404).json({ message: 'Comment not found or you are not the author.' });
            return;
        }

        await existingComment.destroy();

        res.status(200).json({ message: 'Comment deleted successfully.' });
        return;
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error.' });
        return;
    }
};
