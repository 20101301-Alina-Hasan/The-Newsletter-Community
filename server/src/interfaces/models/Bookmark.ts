import { Optional } from 'sequelize';

export interface BookmarkAttributes {
    bookmark_id: number;
    user_id: number;
    news_id: number;
}

export interface BookmarkCreationAttributes extends Optional<BookmarkAttributes, 'bookmark_id'> { }



