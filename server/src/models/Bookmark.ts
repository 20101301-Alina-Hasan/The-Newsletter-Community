import { DataTypes, Model, Sequelize } from 'sequelize';
import { BookmarkAttributes, BookmarkCreationAttributes } from '../interfaces/models/BookmarkInterface';

class Bookmark extends Model<BookmarkAttributes, BookmarkCreationAttributes> implements BookmarkAttributes {
    public bookmark_id!: number;
    public user_id!: number;
    public news_id!: number;
}

export const BookmarkModel = (sequelize: Sequelize) => {
    Bookmark.init(
        {
            bookmark_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: false,
            },
            news_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Bookmark',
            tableName: 'Bookmark',
            timestamps: false,
        }
    );
    return Bookmark;
};
