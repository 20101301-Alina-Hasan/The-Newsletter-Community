import { Optional } from 'sequelize';

export interface CommentAttributes {
    comment_id: number;
    user_id: number;
    news_id: number;
    comment: string;
    created_at: Date;
}

export interface CommentCreationAttributes extends Optional<CommentAttributes, 'comment_id' | 'created_at'> { }



