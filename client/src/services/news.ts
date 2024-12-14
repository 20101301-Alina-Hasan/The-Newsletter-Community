import axios from "axios";
import Cookies from 'js-cookie';
import { NewsProps } from '../interfaces/News';

export const fetchNews = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/news")
        console.log(response);
        return response.data.news || [];
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
};

export const fetchUserNews = async (): Promise<NewsProps['news'][]> => {
    try {
        const token = Cookies.get('access_token');
        if (!token) {
            throw new Error('User is not authenticated.');
        }
        const response = await axios.get('http://localhost:3000/api/news/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response.data)
        return response.data.news || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user-specific news.');
    }
};