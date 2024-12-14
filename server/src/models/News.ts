import { DataTypes, Model, Sequelize } from 'sequelize';
import { NewsAttributes, NewsCreationAttributes } from '../interfaces/models/News';

class News extends Model<NewsAttributes, NewsCreationAttributes> implements NewsAttributes {
    public news_id!: number;
    public user_id!: number;
    public title!: string;
    public releaseDate!: Date;
    public description!: string;
    public thumbnail!: string;
}

export const NewsModel = (sequelize: Sequelize) => {
    News.init(
        {
            news_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(255),
                unique: true,
                allowNull: false,
            },
            releaseDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            thumbnail: {
                type: DataTypes.STRING(255),
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: 'News',
            tableName: 'News',
            timestamps: true,
        }
    );
    return News;
};
