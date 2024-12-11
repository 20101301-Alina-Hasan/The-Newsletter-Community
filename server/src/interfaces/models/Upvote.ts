import { Optional } from 'sequelize';

export interface UpvoteAttributes {
    upvote_id: number;
    user_id: number;
    news_id: number;
}

export interface UpvoteCreationAttributes extends Optional<UpvoteAttributes, 'upvote_id'> { }



