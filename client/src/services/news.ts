import { api } from './axios';

export const fetchNews = async () => {
    try {
        const response = await api.request({
            method: 'GET',
            url: '/news'
        })
        console.log(response);
        return response.data.news;
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
};