import { Sequelize } from 'sequelize';
import { UserModel } from './User';
import { NewsModel } from './News';
import { TagModel } from './Tag';
import { CommentModel } from './Comment';
import { UpvoteModel } from './Upvote';
import { BookmarkModel } from './Bookmark';
import { DB } from '../interfaces/models/DB';
import { sequelize } from './DBconnection';

const db: DB = {
    Sequelize,
    sequelize,
};

// Initialize Models ---

db.User = UserModel(sequelize);
db.News = NewsModel(sequelize);
db.Tag = TagModel(sequelize);
db.Comment = CommentModel(sequelize);
db.Upvote = UpvoteModel(sequelize);
db.Bookmark = BookmarkModel(sequelize);

// Define Relationships ---

// User and News Relationships
db.User.hasMany(db.News, { foreignKey: 'user_id' });
db.News.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Tags Relationships
db.News.belongsToMany(db.Tag, { through: 'News_To_Tags', foreignKey: 'news_id' });
db.Tag.belongsToMany(db.News, { through: 'News_To_Tags', foreignKey: 'tag_id' });

// Comments Relationships
db.News.hasMany(db.Comment, { foreignKey: 'news_id' });
db.User.hasMany(db.Comment, { foreignKey: 'user_id' });
db.Comment.belongsTo(db.News, { foreignKey: 'news_id', onDelete: 'CASCADE' });
db.Comment.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Upvote Relationships
db.User.hasMany(db.Upvote, { foreignKey: 'user_id' });
db.News.hasMany(db.Upvote, { foreignKey: 'news_id' });
db.Upvote.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Upvote.belongsTo(db.News, { foreignKey: 'news_id', onDelete: 'CASCADE' });

// Bookmark Relationships
db.User.hasMany(db.Bookmark, { foreignKey: 'user_id' });
db.News.hasMany(db.Bookmark, { foreignKey: 'news_id' });
db.Bookmark.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Bookmark.belongsTo(db.News, { foreignKey: 'news_id', onDelete: 'CASCADE' });

export default db;
