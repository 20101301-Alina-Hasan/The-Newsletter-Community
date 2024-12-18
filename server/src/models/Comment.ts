import { DataTypes, Model, Sequelize } from 'sequelize';
import { CommentAttributes, CommentCreationAttributes } from '../interfaces/models/CommentInterface';

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public comment_id!: number;
    public user_id!: number;
    public news_id!: number;
    public comment!: string;
    public created_at!: Date;
}

export const CommentModel = (sequelize: Sequelize) => {
    Comment.init(
        {
            comment_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            news_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Comments',
            tableName: 'Comments',
            timestamps: false,
        }
    );
    return Comment;
};

