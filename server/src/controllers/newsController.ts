import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import { fetchUserInteractions, buildNewsObject } from "../helper/newsHelper";
import { UserInteraction } from "../interfaces/newsInterface";
import db from "../models";
import { Op } from "sequelize";

const getNews = async (query: any, res: Response) => {
    try {
        const user_id = query?.user_id;
        const { page = 1, limit = 50, filterTags, ...restQuery } = query;
        const defaultQuery = {
            ...restQuery,
            where: {
                ...restQuery.where
            },
            order: [['releaseDate', 'DESC']],
            limit: parseInt(limit, 10),
            offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
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

//refactor --- (combine controller below)
export const getAllNews = async (req: Request, res: Response): Promise<void> => {
    const { page = 1 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const query = {
        page: pageNumber
    };
    await getNews(query, res);
};

//refactor --- 
export const getUserAllNews = async (req: AuthRequest, res: Response): Promise<void> => {
    const user_id = req.user.userId;
    const { page = 1 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const query = {
        page: pageNumber,
        user_id
    };
    await getNews(query, res);
};

export const getUserNews = async (req: AuthRequest, res: Response): Promise<void> => {
    const user_id = req.user.userId;
    const query = {
        where: { user_id },
        user_id
    };
    await getNews(query, res);
};

//refactor --- (combine controller below)
export const getUserNewsById = async (req: AuthRequest, res: Response): Promise<void> => {
    const { news_id } = req.params;
    const user_id = req.user.userId;

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

//refactor ---
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
    const { news_id } = req.params;

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

        res.status(200).json({ news: newsObject });
    } catch (error) {
        console.error("Error fetching news by ID:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getNewsByBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
    const user_id = req.user.userId;

    try {
        const bookmarks = await db.Bookmark.findAll({
            where: { user_id },
            include: [{ model: db.News, attributes: ["news_id"] }],
        });

        if (!bookmarks || bookmarks.length === 0) {
            res.status(200).json({ message: "No bookmarks found." });
            return;
        }
        const news_ids = bookmarks.map((bookmark: any) => bookmark.News.news_id);

        const query = {
            where: { news_id: { [Op.in]: news_ids } },
            user_id,
        };

        await getNews(query, res);

    } catch (error) {
        console.error("Error fetching bookmarked news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export const searchNews = async (req: AuthRequest, res: Response): Promise<void> => {
    const user_id = req.user?.userId;
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

export const createNews = async (req: AuthRequest, res: Response) => {
    try {
        const { title, releaseDate, description, thumbnail, tag_ids } = req.body;
        const user_id = req.user.userId;
        console.log("Tag_ids", tag_ids)
        if (!title || !releaseDate || !description) {
            res.status(400).json({ message: "All fields are required." });
            return;
        }

        const existingNews = await db.News.findOne({ where: { title: title } });
        if (existingNews) {
            res.status(400).json({ message: 'Title already exists.' });
            return;
        }

        let news; //--dummy news insert
        for (let i = 0; i <= 60; i++) {

            let t = `${title}+${i}`;
            news = await db.News.create({
                user_id,
                title: t,
                releaseDate,
                description,
                thumbnail
            });


        }

        // const news = await db.News.create({
        //     user_id,
        //     title,
        //     releaseDate,
        //     description,
        //     thumbnail
        // });

        if (tag_ids && Array.isArray(tag_ids) && tag_ids.length > 0) {
            const validTagIds = tag_ids.map((tag_id) => parseInt(tag_id, 10)).filter((tag_id) => !isNaN(tag_id));
            await news.addTags(validTagIds);
        }

        console.log("done");

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
        const { title, description, thumbnail, tag_ids } = req.body;
        const user_id = req.user.userId;

        if (!title || !description) {
            res.status(400).json({ message: "All fields are required." });
            return;
        }

        const news = await db.News.findOne({ where: { news_id } });

        if (!news) {
            res.status(404).json({ message: "News not found or unauthorized." });
            return;
        }

        await news.update({
            title,
            description,
            thumbnail
        });

        if (tag_ids && Array.isArray(tag_ids) && tag_ids.length > 0) {
            const validTagIds = tag_ids.map((tag_id) => parseInt(tag_id, 10)).filter((tag_id) => !isNaN(tag_id));
            await news.setTags([]); // Remove old tags
            await news.addTags(validTagIds) //Add new tags
        } else {
            await news.setTags([]);
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



