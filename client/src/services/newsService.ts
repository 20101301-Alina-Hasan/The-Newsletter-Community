import axios, { AxiosRequestConfig } from 'axios';
import { NewsProps } from '../interfaces/newsInterface';

const fetchFactory = async (endpoint: string, config?: AxiosRequestConfig): Promise<NewsProps['news'][]> => {
    try {
        const baseUrl = `http://localhost:4000/api/news${endpoint}`;
        console.log("URL", baseUrl);
        const response = await axios.get(baseUrl, config);
        return response.data.news || [];
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error(`Error fetching from ${endpoint}:`, error.response.data);
            throw new Error(error.response.data.message || 'Failed to fetch news.');
        } else {
            console.error(`Error fetching from ${endpoint}:`, error);
            throw new Error('Failed to fetch news.');
        }
    }
};

export const fetchNews = async (token?: string, user_id?: number, all?: boolean, page?: number) => {
    let endpoint = '/';

    if (all) {
        endpoint += 'all/';
    }

    if (user_id) {
        endpoint += `${user_id}`
    }

    if (page) {
        endpoint += `?page=${page}`;
    }

    const config: AxiosRequestConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

    return await fetchFactory(endpoint, config);
};

export const searchNews = async (query?: string, tagIds?: number[], token?: string, user_id?: number) => {
    const params: string[] = [];
    const config: AxiosRequestConfig = {};
    let endpoint = '';

    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
    } else endpoint += '/all'

    endpoint += '/search';

    if (user_id) endpoint += `/${user_id}`

    if (query) params.push(`query=${query}`);
    if (tagIds && tagIds.length > 0) params.push(`tag_ids=${tagIds.join(',')}`);

    endpoint += `/${params.length > 0 ? `?${params.join('&')}` : ''}`;

    const baseUrl = `http://localhost:4000/api/news${endpoint}`;
    console.log("URL", baseUrl);
    const response = await axios.get(baseUrl, config);

    return response.data.news || [];
};

export const fetchNewsByBookmark = async (token: string) => {
    const endpoint = '/bookmark';
    const config: AxiosRequestConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

    const baseUrl = `http://localhost:4000/api/news${endpoint}`;
    const response = await axios.get(baseUrl, config);
    return response.data.news || [];
}

export const fetchNewsByID = async (news_id: number, token?: string) => {
    let endpoint = '';
    if (!token) endpoint = '/public';
    else endpoint = '/private';

    endpoint += `/${news_id}`;

    const config: AxiosRequestConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};


    const baseUrl = `http://localhost:4000/api/news${endpoint}`;
    const response = await axios.get(baseUrl, config);
    return response.data.news || {};
};

export const createNews = async (formData: FormData, token: string) => {
    try {
        const response = await axios.post('http://localhost:4000/api/news/', formData, {
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

export const updateNews = async (formData: FormData, news_id: number, token: string) => {
    try {
        const response = await axios.put(`http://localhost:4000/api/news/${news_id}`, formData, {
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

export const deleteNews = async (news_id: number, token: string) => {
    try {
        const response = await axios.delete(`http://localhost:4000/api/news/${news_id}`, {
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
