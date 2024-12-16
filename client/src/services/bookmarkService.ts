/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Cookies from 'js-cookie';

export const addBookmark = async (news_id: number) => {
    try {
        const token = Cookies.get('access_token');
        if (!token) {
            throw new Error('Unauthorized. Token is missing.');
        }
        if (!news_id) {
            throw new Error('News ID is required to fetch bookmarks.');
        }
        const response = await axios.post(`http://localhost:3000/api/bookmarks/${news_id}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("bookmarks Response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error(`${error.message}: Error retrieving bookmarks.`);
        throw new Error(error.response?.data?.message || 'Failed to fetch bookmarks.');
    }
}

export const removeBookmark = async (news_id: number) => {
    try {
        const token = Cookies.get('access_token');
        if (!news_id) {
            throw new Error('News ID is required to fetch bookmarks.');
        }
        const response = await axios.delete(`http://localhost:3000/api/bookmarks/${news_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("bookmarks Response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error(`${error.message}: Error retrieving bookmarks.`);
        throw new Error(error.response?.data?.message || 'Failed to fetch bookmarks.');
    }
}
