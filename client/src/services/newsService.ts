/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { NewsProps } from '../interfaces/newsInterface';

const fetchFactory = async (endpoint: string, config?: AxiosRequestConfig): Promise<NewsProps['news'][]> => {
    try {
        const baseUrl = `http://localhost:3000/api/news${endpoint}`;
        // const url = user_id ? `${baseUrl}?user_id=${user_id}` : baseUrl;
        console.log(baseUrl);
        const response = await axios.get(baseUrl, config);
        return response.data.news || [];
    } catch (error: any) {
        console.error(`Error fetching from ${endpoint}:`, error);
        throw new Error(error.response?.data?.message || 'Failed to fetch news.');
    }
};
export const fetchNews = async (news_id?: number, token?: string, all?: boolean, bookmarked?: boolean, page?: number) => {
    let endpoint = '';

    if (token) {
        endpoint = '/user';
        if (news_id) endpoint += `/${news_id}`;
        if (bookmarked) endpoint += '/bookmark';
    } else if (news_id) {
        endpoint += `/${news_id}`;
    }

    if (all) {
        endpoint += '/all';
    }

    if (page) {
        endpoint += `/?page=${page}`;
    }

    const config: AxiosRequestConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

    console.log("Token:", token);
    console.log("Endpoint:", endpoint);
    return await fetchFactory(endpoint, config);
};

export const searchNews = async (query?: string, tagIds?: number[], token?: string) => {
    const params: string[] = [];
    const config: AxiosRequestConfig = {};
    let endpoint = '';

    if (token) {
        endpoint += '/user'
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    endpoint += '/search';

    if (query) params.push(`query=${query}`);
    if (tagIds && tagIds.length > 0) params.push(`tag_ids=${tagIds.join(',')}`);

    endpoint += `/${params.length > 0 ? `?${params.join('&')}` : ''}`;
    console.log("endpoint", endpoint)
    return await fetchFactory(endpoint, config);
};

export const createNews = async (formData: FormData) => {
    try {
        const token = Cookies.get('access_token');
        const response = await axios.post('http://localhost:3000/api/news/', formData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating article:', error);
        throw error;
    }
};

export const updateNews = async (formData: FormData, news_id: number) => {
    try {
        console.log('Logging FormData contents:');
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        const token = Cookies.get('access_token');
        const response = await axios.put(`http://localhost:3000/api/news/${news_id}`, formData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating article:', error);
        throw error;
    }
}

export const deleteNews = async (news_id: number) => {
    try {
        const token = Cookies.get('access_token');
        const response = await axios.delete(`http://localhost:3000/api/news/${news_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting article:', error);
        throw error;
    }
}
