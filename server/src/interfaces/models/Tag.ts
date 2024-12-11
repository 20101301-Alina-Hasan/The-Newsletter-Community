import { Optional } from 'sequelize';

export interface TagAttributes {
    tag_id: number;
    tag: string;
}

export interface TagCreationAttributes extends Optional<TagAttributes, 'tag_id'> { }





