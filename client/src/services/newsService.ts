/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { NewsProps } from '../interfaces/newsInterface';

const fetchNews = async (endpoint: string, config?: AxiosRequestConfig): Promise<NewsProps['news'][]> => {
    try {
        const response = await axios.get(`http://localhost:3000/api/news${endpoint}`, config);
        return response.data.news || [];
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