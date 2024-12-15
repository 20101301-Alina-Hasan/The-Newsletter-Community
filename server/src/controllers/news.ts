import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/auth";
import { formatDate } from "../utils/formatDate";
import db from "../models";

// Update getNews -> filterNews, searchNews, bookmarkNews -> use esClient

const getNews = async (query: object, res: Response) => {
    try {
        const defaultQuery = {
            ...query,
            order: [['releaseDate', 'DESC']],
            include: [
                {
                    model: db.User,
                    attributes: ['username'],
                },
                {
                    model: db.Tag,
                    attributes: ['tag'],
                    through: {
                        attributes: []
                    }
                }
            ]
        };

        let newsList = await db.News.findAll(defaultQuery);

        if (!newsList || newsList.length === 0) {
            res.status(200).json({ message: "No news found." });
            return;
        }

        newsList = await Promise.all(newsList.map(async (news: any) => {
            const upvotes = await db.Upvote.count({
                where: { news_id: news.news_id },
            });

            const commentCount = await db.Comment.count({
                where: { news_id: news.news_id },
            });

            return {
                news_id: news.news_id,
                user_id: news.user_id,
                title: news.title,
                releaseDate: formatDate(news.releaseDate),
                description: news.description,
                thumbnail: news.thumbnail,
                username: news.User.username,
                tags: news.Tags.map((tag: any) => tag.tag),
                upvotes,
                commentCount
            };
        }));

        res.status(200).json({ news: newsList });
        return;
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};


export const getAllNews = async (req: Request, res: Response): Promise<void> => {
    await getNews({}, res);
};


export const getUserNews = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
        res.status(400).json({ message: "User ID is required." });
        return;
    }

    await getNews({ where: { user_id: userId } }, res);
};


export const createNews = async (req: AuthRequest, res: Response) => {
    try {
        const { title, releaseDate, description, thumbnail, tags } = req.body;
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

        const news = await db.News.create({
            user_id,
            title,
            releaseDate,
            description,
            thumbnail
        });

        if (tags && Array.isArray(tags) && tags.length > 0) {
            const validatedTags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0);

            const tagRecords = await Promise.all(
                validatedTags.map(async (tag: string) => {
                    const [newTag] = await db.Tag.findOrCreate({
                        where: { tag }
                    });
                    return newTag;
                })
            );

            await news.addTags(tagRecords);
        }

        res.status(201).json({ message: "News created successfully!", news });
        return;
    } catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};


export const updateNews = async (req: AuthRequest, res: Response) => {
    try {
        const { news_id } = req.params;
        const { title, releaseDate, description, thumbnail, tags } = req.body;
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

        // Update news fields
        await news.update({
            title,
            releaseDate,
            description,
            thumbnail
        });

        // Update tags if provided
        if (tags && Array.isArray(tags) && tags.length > 0) {
            const validatedTags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0);

            // Find or create new tags
            const tagRecords = await Promise.all(
                validatedTags.map(async (tag: string) => {
                    const [newTag] = await db.Tag.findOrCreate({
                        where: { tag }
                    });
                    return newTag;
                })
            );

            // Clear existing associations and add the updated tags
            await news.setTags(tagRecords);
        }

        res.status(200).json({ message: "News updated successfully!", news });
        return;
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};



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

        await news.destroy();
        res.status(200).json({ message: "News deleted successfully!" });
        return;
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};
