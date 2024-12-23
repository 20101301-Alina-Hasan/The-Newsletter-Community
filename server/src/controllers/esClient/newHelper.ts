import { UserCount, UserInteraction } from "../../interfaces/userInterface";
import db from "../../models";

export const fetchCounts = async (news_ids: number[]): Promise<UserCount[]> => {
    const allCounts = await Promise.all(
        news_ids.map(async (news_id) => {
            const [upvotes, commentCount] = await Promise.all([
                db.Upvote.count({ where: { news_id } }),
                db.Comment.count({ where: { news_id } }),
            ]);
            return { upvotes, commentCount };
        })
    );

    return allCounts;
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
