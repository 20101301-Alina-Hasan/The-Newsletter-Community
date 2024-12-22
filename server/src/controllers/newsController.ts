// @ts-nocheck
import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import { fetchUserInteractions, buildNewsObject } from "../helper/newsHelper";
import { UserInteraction } from "../interfaces/newsInterface";
import { client } from "../config/elasticSearch";
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

        console.log("formattedNews", formattedNews);
        res.status(200).json({ news: formattedNews });
        return;
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export const getAllNews = async (req: AuthRequest, res: Response): Promise<void> => {
    const user_id = req.user?.userId;
    const { page = 1 } = req.query;
    const query = {
        page: parseInt(page as string, 10),
        user_id,
    };
    if (user_id) query.where = { user_id };
    await getNews(query, res);
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


        if (tag_ids && Array.isArray(tag_ids) && tag_ids.length > 0) {
            const validTagIds = tag_ids.map((tag_id) => parseInt(tag_id, 10)).filter((tag_id) => !isNaN(tag_id));
            await news.addTags(validTagIds);
        }

        // Indexing games in elastic
        const response = await client.index({
            index: "articles",
            id: `${news.news_id}`,
            body: {
                title: news.title,
                releaseDate: news.releaseDate,
                description: news.description,
                thumbnail: news.thumbnail,
                user_id: news.user_id,
                tag_ids: tag_ids,
            },
        });

        console.log("Elasticsearch response:", response);
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
        const { title, description, releaseDate, thumbnail, tag_ids } = req.body;
        console.log("tag_ids", tag_ids);
        const user_id = req.user.userId;

        const news = await db.News.findOne({ where: { news_id } });

        await news.update({
            title,
            description,
            thumbnail
        });


        let updatedTagIds: number[] = [];
        if (tag_ids && Array.isArray(tag_ids) && tag_ids.length > 0) {
            const validTagIds = tag_ids.map((tag_id) => parseInt(tag_id, 10)).filter((tag_id) => !isNaN(tag_id));
            console.log("Valid Tag IDs:", validTagIds);
            await news.setTags([]);
            await news.addTags(validTagIds)
            updatedTagIds = validTagIds;
            console.log("Updated Tag IDs:", validTagIds);
        } else {
            await news.setTags([]);
        }

        // Updating Elasticsearch document
        const response = await client.update({
            index: "articles",
            id: news.news_id,
            doc: {
                title: news.title,
                releaseDate: news.releaseDate,
                description: news.description,
                thumbnail: news.thumbnail,
                user_id: news.user_id,
                tag_ids: updatedTagIds,
            },
        });

        console.log("Elasticsearch response:", response);

        const retrieved = await client.get({
            index: 'articles',
            id: news.news_id,
        });

        console.log("Retrieved Document:", retrieved);

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

        const news = await db.News.findOne({ where: { news_id, user_id } });

        //Deleting Elasticsearch document
        const response = await client.delete({
            index: "articles",
            id: news.news_id,
        });

        console.log("Document Destroyed:", response);
        await news.destroy();
        res.status(200).json({ message: "News deleted successfully!" });
        return;
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

// Controllers below do not require esClient 
export const getBookmarkedNews = async (req: AuthRequest, res: Response): Promise<void> => {
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

export const getNewsById = async (req: AuthRequest, res: Response): Promise<void> => {
    const { news_id } = req.params;
    const user_id = req.user?.userId;
    try {
        const news = await db.News.findOne({
            where: { news_id },
            include: [
                { model: db.User, attributes: ['username'] },
                { model: db.Tag, attributes: ['tag', 'tag_id'], through: { attributes: [] } },
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

export const searchNewsByESClient = async (req: AuthRequest, res: Response): Promise<void> => {
    const user_id = req.user?.userId;
    const { query, tag_ids } = req.query;

    const searchClause: any = {};

    if (typeof query === 'string' && query.trim()) {
        searchClause.query = {
            multi_match: {
                query: query.trim(),
                fields: ["title^3", "description"],
            }
        };
    }

    const tagFilter: any = tag_ids
        ? {
            terms: {
                tag_ids: tag_ids.split(',').map((tag: string) => parseInt(tag.trim(), 10))
            }
        }
        : null;

    const esQuery: any = {
        from: 0,
        size: 50,
        query: {
            bool: {
                must: [],
                filter: [],
            }
        },
        sort: [
            { releaseDate: { order: 'desc' } }
        ]
    };


    if (user_id) {
        esQuery.query.bool.filter.push({
            term: { user_id }
        });
    }

    if (tagFilter) {
        esQuery.query.bool.filter.push(tagFilter);
    }

    if (searchClause.query) {
        esQuery.query.bool.must.push(searchClause.query);
    }

    try {
        const { body } = await esClient.search({
            index: 'articles',
            body: esQuery
        });

        if (!body.hits.hits || body.hits.hits.length === 0) {
            res.status(200).json({ message: "No news found." });
            return;
        }

        const formattedNews = body.hits.hits.map((hit: any) => {
            return {
                news_id: hit._id,
                title: hit._source.title,
                description: hit._source.description,
                releaseDate: hit._source.releaseDate,
                thumbnail: hit._source.thumbnail,
                user_id: hit._source.user_id,
                tag_ids: hit._source.tag_ids,
            };
        });

        console.log("formattedNews", formattedNews)
        res.status(200).json({ news: formattedNews });
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



