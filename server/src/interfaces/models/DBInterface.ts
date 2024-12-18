import { Sequelize } from "sequelize";

export interface DB {
    sequelize: Sequelize;
    Sequelize: typeof Sequelize;
    User?: any;
    News?: any;
    Tag?: any;
    Comment?: any;
    Upvote?: any;
    Bookmark?: any;
    NewsToTags?: any;
}