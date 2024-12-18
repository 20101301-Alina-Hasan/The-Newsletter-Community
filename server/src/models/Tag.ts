import { DataTypes, Model, Sequelize } from 'sequelize';
import { TagAttributes, TagCreationAttributes } from '../interfaces/models/TagInterface';

export class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
    public tag_id!: number;
    public tag!: string;
}

export const TagModel = (sequelize: Sequelize) => {
    Tag.init(
        {
            tag_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            tag: {
                type: DataTypes.STRING(50),
                unique: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Tags',
            tableName: 'Tags',
            timestamps: false,
        }
    );
    return Tag;
};

