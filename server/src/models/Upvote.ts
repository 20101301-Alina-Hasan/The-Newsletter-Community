import { DataTypes, Model, Sequelize } from 'sequelize';
import { UpvoteAttributes, UpvoteCreationAttributes } from '../interfaces/models/UpvoteInterface';

class Upvote extends Model<UpvoteAttributes, UpvoteCreationAttributes> implements UpvoteAttributes {
    public upvote_id!: number;
    public user_id!: number;
    public news_id!: number;
}

export const UpvoteModel = (sequelize: Sequelize) => {
    Upvote.init(
        {
            upvote_id: {
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
            modelName: 'Upvote',
            tableName: 'Upvote',
            timestamps: false,
        }
    );
    return Upvote;
};

