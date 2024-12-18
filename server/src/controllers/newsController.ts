import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import { fetchUserInteractions, buildNewsObject } from "../helper/newsHelper";
import { UserInteraction } from "../interfaces/news";
import db from "../models";
import { Op } from "sequelize";

// const getNews = async (query: any, res: Response) => {
//     try {
//         const user_id = query?.user_id;
//         const defaultQuery = {
//             ...query,
//             order: [['releaseDate', 'DESC']],
//             include: [
//                 { model: db.User, attributes: ['username'] },
//                 { model: db.Tag, attributes: ['tag'], through: { attributes: [] } },
//             ],
//         };

//         const newsList = await db.News.findAll(defaultQuery);
//         if (!newsList || newsList.length === 0) {
//             return res.status(200).json({ message: "No news found." });
//         }

//         const news_ids = newsList.map((news: any) => news.news_id);
//         let userInteractions: UserInteraction | undefined;
//         if (user_id) {
//             userInteractions = await fetchUserInteractions(user_id, news_ids);
//         }

//         const formattedNews = await Promise.all(
//             newsList.map((news: any) => buildNewsObject(news, userInteractions))
//         );

//         res.status(200).json({ news: formattedNews });
//     } catch (error) {
//         console.error("Error fetching news:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

const getNews = async (query: any, res: Response) => {
    try {
        const user_id = query?.user_id;
        const { filterTags, ...restQuery } = query;

        const defaultQuery = {
            ...restQuery,
            order: [['releaseDate', 'DESC']],
            include: [
                {
                    model: db.User,
                    attributes: ['username'],
                },
                {
                    model: db.Tag,
                    attributes: ['tag', 'tag_id'],
                    through: { attributes: [] },
                    ...(filterTags ? { where: filterTags } : {}),
                },
            ],
        };

        const newsList = await db.News.findAll(defaultQuery);
        if (!newsList || newsList.length === 0) {
            res.status(200).json({ message: "No news found." });
            return;
        }

        const news_ids = newsList.map((news: any) => news.news_id);
        let userInteractions: UserInteraction | undefined;
        if (user_id) {
            userInteractions = await fetchUserInteractions(user_id, news_ids);
        }

        const formattedNews = await Promise.all(
            newsList.map((news: any) => buildNewsObject(news, userInteractions))
        );

        res.status(200).json({ news: formattedNews });
        return;
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export const getAllNews = async (req: Request, res: Response): Promise<void> => {
    const query = req.query || {};
    await getNews(query, res);
};

export const getUserNews = async (req: AuthRequest, res: Response): Promise<void> => {
    const user_id = req.user?.userId;
    const query = { where: { user_id }, user_id: req.query?.user_id };
    await getNews(query, res);
};

// export const searchNews = async (req: Request, res: Response) => {
//     const { query, tag_ids } = req.query;
//     const searchClause: any = {};

//     if (typeof query === 'string' && query.trim()) {
//         searchClause[Op.or] = [
//             { title: { [Op.iLike]: `%${query.trim()}%` } },
//             { description: { [Op.iLike]: `%${query.trim()}%` } },
//         ];
//     }

//     const filterTags = typeof tag_ids === 'string' && tag_ids
//         ? { tag_id: tag_ids.split(',').map(tag_id => parseInt(tag_id.trim(), 10)) }
//         : null;

//     const searchQuery = {
//         ...req.query,
//         where: searchClause,
//         filterTags,
//     };

//     await getNews(searchQuery, res);
// };

export const searchNews = async (req: AuthRequest, res: Response): Promise<void> => {
    const user_id = req.user?.userId;
    console.log(req.user, user_id);
    const { query, tag_ids } = req.query;
    const searchClause: any = {};

    if (typeof query === 'string' && query.trim()) {
        searchClause[Op.or] = [
            { title: { [Op.iLike]: `%${query.trim()}%` } },
            { description: { [Op.iLike]: `%${query.trim()}%` } },
        ];
    }

    const filterTags = typeof tag_ids === 'string' && tag_ids
        ? { tag_id: tag_ids.split(',').map(tag_id => parseInt(tag_id.trim(), 10)) }
        : null;

    const searchQuery = {
        where: {
            ...(user_id ? { user_id } : {}),
            ...searchClause,
        },
        filterTags,
    };

    await getNews(searchQuery, res);
};


export const getNewsById = async (req: Request, res: Response): Promise<void> => {
    const { news_id } = req.params;
    const user_id = req.query?.user_id;

    if (!news_id) {
        res.status(400).json({ message: "News ID is required." });
        return;
    }

    try {
        const news = await db.News.findOne({
            where: { news_id },
            include: [
                { model: db.User, attributes: ['username'] },
                { model: db.Tag, attributes: ['tag'], through: { attributes: [] } },
            ],
        });

        if (!news) {
            res.status(404).json({ message: "News not found." });
            return;
        }

        const newsObject = await buildNewsObject(news);

        if (user_id) {
            const userInteractions = await fetchUserInteractions(Number(user_id), [Number(news_id)]);
            newsObject.hasUpvoted = userInteractions.upvotedNewsIds.includes(news.news_id);
            newsObject.hasBookmarked = userInteractions.bookmarkedNewsIds.includes(news.news_id);
        }

        res.status(200).json({ news: newsObject });
    } catch (error) {
        console.error("Error fetching news by ID:", error);
        res.status(500).json({ message: "Internal server error." });
    }
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
        console.log(news_id)
        const { title, description, thumbnail, tags } = req.body;
        console.log({ title, description, thumbnail, tags });
        const user_id = req.user?.userId;
        if (!title || !description) {
            res.status(400).json({ message: "All fields are required." });
            return;
        }
        const news = await db.News.findOne({ where: { news_id, user_id } });
        if (!news) {
            res.status(404).json({ message: "News not found or unauthorized." });
            return;
        }
        await news.update({
            title,
            description,
            thumbnail
        });

        if (!tags) {
            await news.setTags([]);
        } else {
            const validatedTags = tags.map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
            const tagRecords = await Promise.all(
                validatedTags.map(async (tag: string) => {
                    const [newTag] = await db.Tag.findOrCreate({
                        where: { tag }
                    });
                    return newTag;
                })
            );
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
























// Common news fetching logic
// const getNews = async (query: any, res: Response) => {
//     const { user_id, query: searchQuery, tag_ids } = query || {};

//     let whereClause: any = {};

//     if (searchQuery) {
//         whereClause = {
//             [Op.or]: [
//                 { title: { [Op.iLike]: `%${searchQuery}%` } },
//                 { description: { [Op.iLike]: `%${searchQuery}%` } },
//             ],
//         };
//     }

//     const formattedTagIds: number[] = tag_ids ?
//         tag_ids.split(',').map((tag_id: string) => parseInt(tag_id.trim(), 10))
//         : [];
//     const tagFilter = formattedTagIds.length > 0 ? { tag_id: formattedTagIds } : null;

//     try {
//         const defaultQuery = {
//             where: whereClause,
//             order: [['releaseDate', 'DESC']],
//             include: [
//                 { model: db.User, attributes: ['username'] },
//                 { model: db.Tag, attributes: ['tag'], through: { attributes: [] }, where: tagFilter },
//             ],
//         };

//         // Apply user filter if user_id is provided (e.g., in getUserNews)
//         if (user_id) {
//             defaultQuery.where = { ...defaultQuery.where, user_id };
//         }

//         const newsList = await db.News.findAll(defaultQuery);

//         if (!newsList || newsList.length === 0) {
//             return res.status(200).json({ message: "No news found." });
//         }

//         const news_ids = newsList.map((news: any) => news.news_id);
//         let userInteractions: { upvotedNewsIds: number[]; bookmarkedNewsIds: number[] } | undefined;

//         if (user_id) {
//             userInteractions = await fetchUserInteractions(user_id, news_ids);
//         }

//         const formattedNews = await Promise.all(
//             newsList.map((news: any) => buildNewsObject(news, userInteractions))
//         );

//         res.status(200).json({ news: formattedNews });
//     } catch (error) {
//         console.error("Error fetching news:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

// // Controller functions
// export const getAllNews = async (req: Request, res: Response): Promise<void> => {
//     const query = req.query || {};
//     await getNews(query, res);
// };

// export const getUserNews = async (req: AuthRequest, res: Response): Promise<void> => {
//     const user_id = req.user?.userId;
//     const query = { user_id };
//     await getNews(query, res);
// };

// export const searchNews = async (req: Request, res: Response): Promise<void> => {
//     const query = req.query || {};
//     await getNews(query, res);
// };



