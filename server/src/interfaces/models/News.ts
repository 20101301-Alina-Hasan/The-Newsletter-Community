import { Optional } from 'sequelize';

export interface NewsAttributes {
    news_id: number;
    user_id: number;
    title: string;
    releaseDate: Date;
    description: string;
    thumbnail: string;
}

export interface NewsCreationAttributes extends Optional<NewsAttributes, 'news_id' | 'thumbnail'> { }




