import { Optional } from 'sequelize';

export interface UserAttributes {
    user_id: number;
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'user_id'> { }



