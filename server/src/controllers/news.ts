import { Response } from "express";
import { AuthRequest } from "../interfaces/auth";
import { addCloudinaryImage, deleteCloudinaryImage } from "../utils/cloudinary";
import db from "../models";

// getNews, filterNews, sortNews, esClient

// Get all news items
export const getNews = async (req: AuthRequest, res: Response) => {
    try {
        const newsList = await db.News.findAll();

        if (!newsList || newsList.length === 0) {
            res.status(404).json({ message: "No news found." });
        }

        res.status(200).json({ news: newsList });
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Create a news item
export const createNews = async (req: AuthRequest, res: Response) => {
    try {
        const { title, releaseDate, description, thumbnail } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User ID not found." });
        }

        if (!title || !releaseDate || !description) {
            res.status(400).json({ message: "All fields are required." });
        }

        const existingNews = await db.News.findOne({ where: { title: title } });
        if (existingNews) {
            res.status(400).json({ message: 'Title already exists.' });
        }

        let thumbnailUrl;

        // If thumbnail provided and it's base64 (Image), upload it to Cloudinary
        if (thumbnail && thumbnail.startsWith('data:image/')) {
            thumbnailUrl = await addCloudinaryImage(thumbnail);
        }

        // Create news item in the database
        const news = await db.News.create({
            user_id: userId,
            title,
            releaseDate,
            description,
            thumbnail: thumbnailUrl,
        });

        res.status(201).json({ message: "News created successfully!", news });
    } catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Update a news item
export const updateNews = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, releaseDate, description, thumbnail } = req.body;
        const userId = req.user?.userId;

        if (!title || !releaseDate || !description) {
            res.status(400).json({ message: "All fields are required." });
        }

        const news = await db.News.findOne({ where: { news_id: id, user_id: userId } });

        if (!news) {
            res.status(404).json({ message: "News not found or unauthorized." });
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
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Delete a news item
export const deleteNews = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User ID not found." });
        }

        const news = await db.News.findOne({ where: { news_id: id, user_id: userId } });

        if (!news) {
            res.status(404).json({ message: "News not found or unauthorized." });
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
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
