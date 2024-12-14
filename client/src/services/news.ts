import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { NewsProps } from '../interfaces/News';

const fetchNews = async (endpoint: string, config?: AxiosRequestConfig): Promise<NewsProps['news'][]> => {
    try {
        const response = await axios.get(`http://localhost:3000/api/news${endpoint}`, config);
        console.log("API Response:", response.data);
        return response.data.news || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(`Error fetching from ${endpoint}:`, error);
        throw new Error(error.response?.data?.message || 'Failed to fetch news.');
    }
};

export const fetchAllNews = async (): Promise<NewsProps['news'][]> => {
    const endpoint = '';
    return await fetchNews(endpoint);
};

export const fetchUserNews = async (): Promise<NewsProps['news'][]> => {
    const token = Cookies.get('access_token');
    if (!token) {
        throw new Error('User is not authenticated.');
    }
    const endpoint = "/user";
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return await fetchNews(endpoint, config);
};
