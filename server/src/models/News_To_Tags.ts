import { DataTypes, Model, Sequelize } from 'sequelize';

class NewsToTags extends Model {
    public news_id!: number;
    public tag_id!: number;
}

export const NewsToTagsModel = (sequelize: Sequelize) => {
    NewsToTags.init(
        {
            news_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'News', // Name of the News table
                    key: 'news_id',
                },
                onDelete: 'CASCADE',
            },
            tag_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Tags', // Name of the Tags table
                    key: 'tag_id',
                },
                onDelete: 'CASCADE',
            },
        },
        {
            sequelize,
            modelName: 'NewsToTags',
            tableName: 'News_To_Tags',
            timestamps: false, // Ensure timestamps are disabled
        }
    );
    return NewsToTags;
};
