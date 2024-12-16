export interface CommentCountProps {
    count: number
}

export interface CommentsProps {
    news_id: number;
    news?: {
        comment_id: number;
        user_id: number;
        comment: string;
        created_at: string;
        username: string;
        name: string;

    }
}