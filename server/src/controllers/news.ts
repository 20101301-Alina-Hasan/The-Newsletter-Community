import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/auth";
import { addCloudinaryImage, deleteCloudinaryImage } from "../utils/cloudinary";
import db from "../models";

// Update getNews -> filterNews, sortNews -> use esClient

// Common function to fetch news
const fetchNews = async (query: object, res: Response) => {
    try {
        const newsList = await db.News.findAll(query);

        if (!newsList || newsList.length === 0) {
            res.status(200).json({ message: "No news found." });
            return;
        }

        res.status(200).json({ news: newsList });
        return;
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

// Get all news articles
export const getNews = async (req: Request, res: Response): Promise<void> => {
    await fetchNews({}, res);
};

// Get all user articles
export const getUserNews = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }

    await fetchNews({ where: { user_id: userId } }, res);
};

// Create a news item
export const createNews = async (req: AuthRequest, res: Response) => {
    try {
        const { title, releaseDate, description, thumbnail } = req.body;
        const user_id = req.user?.userId;

        if (!user_id) {
            res.status(403).json({ message: "Unauthorized: User ID not found." });
            return;
        }

        if (!title || !releaseDate || !description) {
            res.status(400).json({ message: "All fields are required." });
            return;
        }

        const existingNews = await db.News.findOne({ where: { title: title } });
        if (existingNews) {
            res.status(400).json({ message: 'Title already exists.' });
            return;
        }

        let thumbnailUrl;

        // If thumbnail provided and it's base64 (Image), upload it to Cloudinary
        if (thumbnail && thumbnail.startsWith('data:image/')) {
            thumbnailUrl = await addCloudinaryImage(thumbnail);
        }

        // Create news item in the database
        const news = await db.News.create({
            user_id,
            title,
            releaseDate,
            description,
            thumbnail: thumbnailUrl,
        });

        res.status(201).json({ message: "News created successfully!", news });
        return;
    } catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

// Update a news item
export const updateNews = async (req: AuthRequest, res: Response) => {
    try {
        const { news_id } = req.params;
        const { title, releaseDate, description, thumbnail } = req.body;
        const user_id = req.user?.userId;

        if (!title || !releaseDate || !description) {
            res.status(400).json({ message: "All fields are required." });
            return;
        }

        const news = await db.News.findOne({ where: { news_id, user_id } });

        if (!news) {
            res.status(404).json({ message: "News not found or unauthorized." });
            return;
        }

        let thumbnailUrl = news.thumbnail;

        // If a new thumbnail URL or base64 is provided
        if (thumbnail && thumbnail.startsWith('data:image/')) {
            // If there's an old thumbnail, delete it from Cloudinary first
            if (news.thumbnail) {
                try {
                    await deleteCloudinaryImage(news.thumbnail);
                } catch (cloudinaryError) {
                    console.error("Error deleting old thumbnail from Cloudinary:", cloudinaryError);
                }
            }
            // Upload new thumbnail to Cloudinary
            thumbnailUrl = await addCloudinaryImage(thumbnail);
        }

        // Update the news item
        await news.update({
            title,
            releaseDate,
            description,
            thumbnail: thumbnailUrl,
        });

        res.status(200).json({ message: "News updated successfully!", news });
        return;
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

// Delete a news item
export const deleteNews = async (req: AuthRequest, res: Response) => {
    try {
        const { news_id } = req.params;
        const user_id = req.user?.userId;

        if (!user_id) {
            res.status(403).json({ message: "Unauthorized: User ID not found." });
            return;
        }

        const news = await db.News.findOne({ where: { news_id, user_id } });

        if (!news) {
            res.status(404).json({ message: "News not found or unauthorized." });
            return;
        }

        // Optional: Delete thumbnail from Cloudinary
        if (news.thumbnail) {
            try {
                await deleteCloudinaryImage(news.thumbnail);
            } catch (cloudinaryError) {
                console.error("Error deleting thumbnail from Cloudinary:", cloudinaryError);
            }
        }

        // Delete the news item
        await news.destroy();
        res.status(200).json({ message: "News deleted successfully!" });
        return;
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};
