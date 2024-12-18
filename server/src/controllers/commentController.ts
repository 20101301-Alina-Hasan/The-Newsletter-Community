import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import { timeAgo } from "../utils/time";
import { CommentProps } from "../interfaces/commentInterface";
import db from "../models";

export const getComments = async (req: Request, res: Response) => {
    const { news_id } = req.params;
    if (!news_id) {
        res.status(400).json({ message: 'News ID is required.' });
        return;
    }
    try {
        let comments = await db.Comment.findAll({
            where: { news_id },
            include: [
                {
                    model: db.User,
                    attributes: ['username', 'name'],
                },
            ],
            order: [['created_at', 'DESC']],
        });
        comments = comments.map((comment: CommentProps) => ({
            comment_id: comment.comment_id,
            user_id: comment.user_id,
            comment: comment.comment,
            created_at: timeAgo(comment.created_at),
            username: comment.User.username,
            name: comment.User.name,
        }));
        res.status(200).json({ comments });
        return;
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error.' });
        return;
    }
};


export const addComment = async (req: AuthRequest, res: Response) => {
    try {
        const { news_id } = req.params;
        const { comment } = req.body;

        if (!news_id || !comment) {
            res.status(400).json({ message: 'News ID and comment text are required.' });
            return;
        }
        const newComment = await db.Comment.create({
            user_id: req.user.userId,
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

export const updateComment = async (req: AuthRequest, res: Response) => {
    try {
        const { comment_id } = req.params;
        const { comment } = req.body;
        if (!comment) {
            res.status(400).json({ message: 'Comment text is required.' });
            return;
        }
        const existingComment = await db.Comment.findOne({ where: { comment_id } });
        if (!existingComment) {
            res.status(404).json({ message: 'Comment not found or you are not the author.' });
            return;
        }
        existingComment.comment = comment;
        await existingComment.save();
        res.status(200).json({ message: 'Comment updated successfully.', comment: existingComment });
        return;
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Internal server error.' });
        return;
    }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
    try {
        const { comment_id } = req.params;
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
