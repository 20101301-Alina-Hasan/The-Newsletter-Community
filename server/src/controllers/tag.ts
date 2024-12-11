import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/auth";
import db from "../models";

// Get all tags of an article
export const getTags = async (req: Request, res: Response) => {
    const { news_id } = req.params;

    if (!news_id) {
        res.status(400).json({ message: 'News ID is required.' });
        return;
    }

    try {
        const news = await db.News.findByPk(news_id, {
            include: [{ model: db.Tag, attributes: ['tag'], through: { attributes: [] } }],
            order: [[db.Tag, 'tag', 'ASC']], // Order tags alphabetically
        });

        if (!news) {
            res.status(404).json({ message: 'News article not found.' });
            return;
        }

        if (!news.Tags || news.Tags.length === 0) {
            res.status(404).json({ message: 'No tags found on this news article.' });
            return;
        }

        res.status(200).json({ tags: news.Tags });
    } catch (error) {
        console.error('Error fetching Tags:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// Add a tag to an article
export const addTag = async (req: AuthRequest, res: Response) => {
    const { news_id } = req.params;
    const { tag } = req.body;

    if (!news_id || !tag) {
        res.status(400).json({ message: 'News ID and tag text are required.' });
        return;
    }

    try {
        // Find or create the tag
        const [newTag] = await db.Tag.findOrCreate({
            where: { tag },
        });

        // Find the news article
        const news = await db.News.findByPk(news_id);
        if (!news) {
            res.status(404).json({ message: 'News article not found.' });
            return;
        }

        // Associate the tag with the news article
        await news.addTag(newTag);

        res.status(201).json({ message: 'Tag added successfully.', tag: newTag });
    } catch (error) {
        console.error('Error adding Tag:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Delete a tag from an article
export const deleteTag = async (req: AuthRequest, res: Response) => {
    const { news_id, tag_id } = req.params;

    if (!news_id || !tag_id) {
        res.status(400).json({ message: 'News ID and Tag ID are required.' });
        return;
    }

    try {
        // Find the news article
        const news = await db.News.findByPk(news_id);
        if (!news) {
            res.status(404).json({ message: 'News article not found.' });
            return;
        }

        // Find the tag
        const tag = await db.Tag.findByPk(tag_id);

        if (!tag) {
            res.status(404).json({ message: 'Tag not found.' });
            return;
        }

        const newsWithTag = await news.hasTag(tag);

        if (!newsWithTag) {
            res.status(404).json({ message: 'Tag is not associated with this news article.' });
            return;
        }

        // Remove the association
        await news.removeTag(tag);

        res.status(200).json({ message: 'Tag removed successfully.' });
    } catch (error) {
        console.error('Error deleting Tag:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

