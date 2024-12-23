import { fetchUserInteractions, fetchCounts } from "./newHelper";
import { AuthRequest } from "../../interfaces/authInterface";
import { User, UserInteraction } from "../../interfaces/userInterface";
import { Tag } from "../../interfaces/tagInterface";
import { client } from "../../config/elasticSearch";
import { formatDate } from "../../utils/time";
import { Response } from "express";
import db from "../../models";

// export const getNewsByESClient = async (req: AuthRequest, res: Response): Promise<void> => {
//     try {
//         const page = parseInt(req.query.page as string) - 1 || 0;
//         const limit = parseInt(req.query.limit as string) || 50;
//         const offset = page * limit;
//         const user_id = req.user ? req.user.userId : null;
//         const query = req.query.query ? (req.query.query as string).trim() : "";
//         const tag_ids = req.query.tag_ids ? (req.query.tag_ids as string).split(',').map(tag => parseInt(tag.trim(), 10)) : [];

//         const esQuery = {
//             index: 'articles',
//             from: offset,
//             size: limit,
//             body: {
//                 query: {
//                     bool: {
//                         filter: [
//                             ...(user_id ? [{ term: { user_id: user_id } }] : []),
//                             ...(tag_ids.length ? [{ terms: { tag_ids: tag_ids } }] : []),
//                         ],
//                         must: query ? [
//                             { // If 4 terms are queried, at least 2 terms should match
//                                 multi_match: {
//                                     query: query,
//                                     fields: ["title^3", "description"],
//                                     minimum_should_match: "50%",
//                                     // type: "phrase",
//                                     // type: "phrase_prefix",
//                                     // operator: "or",
//                                     // fuzziness: "2"
//                                 }
//                             }
//                         ] : [{ match_all: {} }],
//                     }
//                 },
//                 sort: [{ releaseDate: { order: 'desc' } }]
//             }
//         };

//         const { hits } = await client.search(esQuery);

//         const news = hits.hits.map((hit: any) => {
//             const { ...newsData } = hit._source;
//             return {
//                 ...newsData,
//                 news_id: parseInt(hit._id!),
//             };
//         });

//         const user_ids = news.map((news) => news.user_id);
//         const news_ids = news.map((news) => news.news_id);

//         const [tags, users, userInteractions] = await Promise.all([
//             tag_ids.length ? db.Tag.findAll({ where: { tag_id: tag_ids } }) : db.Tag.findAll(),
//             db.User.findAll({ where: { user_id: user_ids } }),
//             user_id ? fetchUserInteractions(user_id, news_ids) : { upvotedNewsIds: [], bookmarkedNewsIds: [] } as UserInteraction
//         ]);

//         // console.log("userInteractions:", userInteractions);

//         const tagMap: { [key: number]: Tag } = Object.fromEntries(tags.map((tag: Tag) => [tag.tag_id, tag]));
//         const userMap: { [key: number]: string } = Object.fromEntries(users.map((user: User) => [user.user_id, user.username]));
//         const counts = await fetchCounts(news_ids);

//         // Map through the news and include counts, interactions, and other info
//         const formattedNews = news.map((news, index) => {
//             const { upvotes, commentCount } = counts[index];  // Get counts corresponding to each news item
//             const { tag_ids, ...newsData } = news;
//             return {
//                 ...newsData,
//                 upvotes,
//                 commentCount,
//                 username: userMap[news.user_id],
//                 releaseDate: formatDate(news.releaseDate),
//                 tags: (news.tag_ids || []).map((tag_id: number) => tagMap[tag_id]).filter(Boolean),
//                 hasUpvoted: userInteractions.upvotedNewsIds.includes(news.news_id) ? true : false, //85
//                 hasBookmarked: userInteractions.bookmarkedNewsIds.includes(news.news_id) ? true : false //86
//             };
//         });

//         // console.log("News", formattedNews);

//         res.status(200).json({
//             news: news.length > 0 ? formattedNews : [],
//             message: news.length ? undefined : "No news found."
//         });
//     } catch (error) {
//         console.error("Error fetching news:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

export const getNewsByESClient = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log("IN")
        const page = parseInt(req.query.page as string) - 1 || 0;
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = page * limit;

        const authUserId = req.user?.userId || null;
        const paramUserId = req.params.user_id ? parseInt(req.params.user_id) : null;

        const query = req.query.query ? (req.query.query as string).trim() : "";
        const tag_ids = req.query.tag_ids
            ? (req.query.tag_ids as string).split(',').map(tag => parseInt(tag.trim(), 10))
            : [];

        // Filter for specific user's news if user_id is provided as a param
        const filterConditions = [
            ...(authUserId ? [{ term: { user_id: authUserId } }] : []),
            ...(tag_ids.length ? [{ terms: { tag_ids } }] : [])
        ];

        const esQuery = {
            index: 'articles',
            from: offset,
            size: limit,
            body: {
                query: {
                    bool: {
                        filter: filterConditions,
                        must: query
                            ? [{ multi_match: { query, fields: ["title^3", "description"], minimum_should_match: "75%" } }]
                            : [{ match_all: {} }],
                    }
                },
                sort: [{ releaseDate: { order: 'desc' } }]
            }
        };

        const { hits } = await client.search(esQuery);

        const news = hits.hits.map((hit: any) => {
            const { ...newsData } = hit._source;
            return {
                ...newsData,
                news_id: parseInt(hit._id!),
            };
        });

        const user_ids = news.map((n) => n.user_id);
        const news_ids = news.map((n) => n.news_id);

        const [tags, users, userInteractions]: [Tag[], User[], UserInteraction] = await Promise.all([
            tag_ids.length ? db.Tag.findAll({ where: { tag_id: tag_ids } }) : db.Tag.findAll(),
            db.User.findAll({ where: { user_id: user_ids } }),
            paramUserId
                ? fetchUserInteractions(paramUserId, news_ids)  // Interactions for logged-in user
                : { upvotedNewsIds: [], bookmarkedNewsIds: [] }
        ]);

        const tagMap = Object.fromEntries(tags.map((tag: Tag) => [tag.tag_id, tag]));
        const userMap = Object.fromEntries(users.map((user: User) => [user.user_id, user.username]));
        const counts = await fetchCounts(news_ids);

        const formattedNews = news.map((news, index) => {
            const { upvotes, commentCount } = counts[index] || { upvotes: 0, commentCount: 0 };
            return {
                ...news,
                upvotes,
                commentCount,
                username: userMap[news.user_id],
                releaseDate: formatDate(news.releaseDate),
                tags: (news.tag_ids || []).map((tag_id: number) => tagMap[tag_id]).filter(Boolean),
                hasUpvoted: userInteractions.upvotedNewsIds.includes(news.news_id),
                hasBookmarked: userInteractions.bookmarkedNewsIds.includes(news.news_id)
            };
        });

        res.status(200).json({
            news: news.length > 0 ? formattedNews : [],
            message: news.length ? undefined : "No news found."
        });
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const createNewsByESClient = async (req: AuthRequest, res: Response) => {
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

        console.log("Created news:", response);

        res.status(201).json({ message: "News created successfully!", news });
        return;
    } catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export const updateNewsByESClient = async (req: AuthRequest, res: Response) => {
    try {
        const { news_id } = req.params;
        const { title, description, thumbnail, tag_ids } = req.body;

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

        console.log("Updated news:", response);

        res.status(200).json({ message: "News updated successfully!", news });
        return;
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};

export const deleteNewsByESClient = async (req: AuthRequest, res: Response) => {
    try {
        const { news_id } = req.params;
        const user_id = req.user?.userId;

        const news = await db.News.findOne({ where: { news_id, user_id } });

        const response = await client.delete({
            index: "articles",
            id: news.news_id,
        });

        console.log("Deleted news:", response);

        await news.destroy();
        res.status(200).json({ message: "News deleted successfully!" });
        return;
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: "Internal server error." });
        return;
    }
};