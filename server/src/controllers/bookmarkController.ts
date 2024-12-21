import { Response } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import db from "../models";

export const addBookmark = async (req: AuthRequest, res: Response) => {
    const { news_id } = req.params;
    const user_id = req.user.userId;

    try {
        const existingBookmark = await db.Bookmark.findOne({
            where: { news_id, user_id },
        });

        if (existingBookmark) {
            res.status(400).json({ message: "Bookmark already exists." });
            return;
        }

        const newBookmark = await db.Bookmark.create({ news_id, user_id });
        res.status(201).json({ message: "Bookmark added successfully.", bookmark: newBookmark });
    } catch (error) {
        console.error("Error adding bookmark:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const removeBookmark = async (req: AuthRequest, res: Response) => {
    const { news_id } = req.params;
    const user_id = req.user.userId;
    try {
        const bookmark = await db.Bookmark.findOne({
            where: { news_id, user_id },
        });

        if (!bookmark) {
            res.status(404).json({ message: "Bookmark not found." });
            return;
        }

        await bookmark.destroy();
        res.status(200).json({ message: "Bookmark removed successfully." });
    } catch (error) {
        console.error("Error removing bookmark:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
