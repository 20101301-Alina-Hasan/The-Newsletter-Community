export interface CommentProps {
    comment_id: number;
    user_id: number;
    news_id: number;
    comment: string;
    created_at: string;
    User: {
        username: string;
        name: string;
    }
}