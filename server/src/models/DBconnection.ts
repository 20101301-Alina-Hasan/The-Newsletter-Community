import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('newsportal', 'postgres', 'alina', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('🎉 Database connected successfully!');
    } catch (error) {
        console.log(`😞 Sorry, something went wrong! ${error}`);
    }
};
