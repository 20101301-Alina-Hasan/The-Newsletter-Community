/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { NewsProps } from '../interfaces/newsInterface';

const fetchNews = async (endpoint: string, user_id?: number, config?: AxiosRequestConfig): Promise<NewsProps['news'][]> => {
    try {
        const baseUrl = `http://localhost:3000/api/news${endpoint}`;
        const url = user_id ? `${baseUrl}?user_id=${user_id}` : baseUrl;
        const response = await axios.get(url, config);
        return response.data.news || [];
    } catch (error: any) {
        console.error(`Error fetching from ${endpoint}:`, error);
        throw new Error(error.response?.data?.message || 'Failed to fetch news.');
    }
};

export const fetchAllNews = async (user_id?: number): Promise<NewsProps['news'][]> => {
    const endpoint = '';
    return await fetchNews(endpoint, user_id);
};

export const fetchUserNews = async (user_id: number | undefined): Promise<NewsProps['news'][]> => {
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
    return await fetchNews(endpoint, user_id, config);
};

export const fetchNewsById = async (news_id: number, user_id: number | undefined) => {
    console.log("fetchNewsById:", news_id, user_id)
    const endpoint = `/${news_id}`;
    return await fetchNews(endpoint, user_id);
}

// export const searchNews = async (query?: string, tagIds?: number[], user_id?: number): Promise<NewsProps['news'][]> => {
//     let endpoint = '/search';
//     const params: string[] = [];

//     if (query) params.push(`query=${query}`);
//     if (tagIds && tagIds.length > 0) params.push(`tag_ids=${tagIds.join(',')}`);
//     if (params.length > 0) {
//         endpoint += `?${params.join('&')}`;
//     }

//     return await fetchNews(endpoint, user_id);
// };

export const searchNews = async (query?: string, tagIds?: number[], user_id?: number): Promise<NewsProps['news'][]> => {
    const params: string[] = [];
    const token = Cookies.get('access_token');
    const config: AxiosRequestConfig = {};
    let endpoint = '/search';

    if (user_id) {
        if (!token) {
            throw new Error('User is not authenticated.');
        }
        endpoint += '/user'
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
    }

    if (query) params.push(`query=${query}`);
    if (tagIds && tagIds.length > 0) params.push(`tag_ids=${tagIds.join(',')}`);

    endpoint += `/${params.length > 0 ? `?${params.join('&')}` : ''}`;
    console.log("endpoint", endpoint)
    return await fetchNews(endpoint, user_id, config);
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