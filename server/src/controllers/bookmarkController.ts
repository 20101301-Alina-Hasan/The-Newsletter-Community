import { Response } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import db from "../models";

// Get User Bookmark on a Specific News Article
// export const getBookmark = async (req: AuthRequest, res: Response) => {
//     const { news_id } = req.params;
//     const user_id = req.user.userId;

//     if (!news_id) {
//         res.status(400).json({ message: "News ID is required." });
//         return;
//     }

//     try {
//         const bookmark = await db.Bookmark.findOne({
//             where: { news_id, user_id },
//         });

//         res.status(200).json({ isBookmarked: !!bookmark });
//     } catch (error) {
//         console.error("Error fetching bookmark:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

// export const getBookmarks = async (req: AuthRequest, res: Response) => {
//     const user_id = req.user.userId;

//     try {
//         const bookmarks = await db.Bookmark.findAll({
//             where: { user_id },
//             include: [{ model: db.News, attributes: ["title", "description"] }],
//         });

//         res.status(200).json({ bookmarks });
//     } catch (error) {
//         console.error("Error fetching user bookmarks:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

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
