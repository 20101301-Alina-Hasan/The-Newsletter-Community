import { UserCount, UserInteraction } from "../interfaces/userInterface";
import { formatDate } from "../utils/time";
import db from "../models";

export const fetchCounts = async (news_id: number): Promise<UserCount> => {
    const [upvotes, commentCount] = await Promise.all([
        db.Upvote.count({ where: { news_id } }),
        db.Comment.count({ where: { news_id } }),
    ]);
    return { upvotes, commentCount };
};

export const fetchUserInteractions = async (user_id: number, news_id: number[]): Promise<UserInteraction> => {
    const [upvotedNews, bookmarkedNews] = await Promise.all([
        db.Upvote.findAll({ where: { user_id, news_id }, attributes: ['news_id'] }),
        db.Bookmark.findAll({ where: { user_id, news_id }, attributes: ['news_id'] }),
    ]);

    return {
        upvotedNewsIds: upvotedNews.map((upvote: any) => upvote.news_id),
        bookmarkedNewsIds: bookmarkedNews.map((bookmark: any) => bookmark.news_id),
    };
};

export const buildNewsObject = async (news: any, userInteractions?: UserInteraction) => {
    const { upvotes, commentCount } = await fetchCounts(news.news_id);
    const newsObject: any = {
        news_id: news.news_id,
        user_id: news.user_id,
        title: news.title,
        releaseDate: formatDate(news.releaseDate),
        description: news.description,
        thumbnail: news.thumbnail,
        username: news.User.username,
        tags: news.Tags,
        upvotes,
        commentCount,
    };
    console.log("obj", newsObject, userInteractions);

    if (userInteractions) {
        newsObject.hasUpvoted = userInteractions.upvotedNewsIds.includes(news.news_id);
        newsObject.hasBookmarked = userInteractions.bookmarkedNewsIds.includes(news.news_id);
    }

    console.log("with intercations", newsObject);

    return newsObject;
};

