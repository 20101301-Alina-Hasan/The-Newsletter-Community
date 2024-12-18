import { Model, DataTypes, Sequelize } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from '../interfaces/models/UserInterface';

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public user_id!: number;
    public name!: string;
    public username!: string;
    public email!: string;
    public password!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const UserModel = (sequelize: Sequelize) => {
    User.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(50),
            },
            username: {
                type: DataTypes.STRING(50),
                unique: true,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(50),
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'Users',
            timestamps: true,
        }
    );
    return User;
};


