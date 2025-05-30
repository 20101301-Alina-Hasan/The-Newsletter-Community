/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
// import Cookies from 'js-cookie';

export const fetchUpvotes = async (news_id: number) => {
    try {
        if (!news_id) {
            throw new Error('News ID is required to fetch upvotes.');
        }
        const response = await axios.get(`http://localhost:4000/api/upvotes/${news_id}`);
        return response.data.upvotes;
    } catch (error: any) {
        console.error(`${error.message}: Error retrieving upvotes.`);
        throw new Error(error.response?.data?.message || 'Failed to fetch upvotes.');
    }
};

export const addUpvote = async (news_id: number, token: string) => {
    try {
        if (!token) {
            throw new Error('Unauthorized. Token is missing.');
        }
        if (!news_id) {
            throw new Error('News ID is required to fetch upvotes.');
        }
        const response = await axios.post(`http://localhost:4000/api/upvotes/${news_id}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error(`${error.message}: Error retrieving upvotes.`);
        throw new Error(error.response?.data?.message || 'Failed to fetch upvotes.');
    }
}

export const removeUpvote = async (news_id: number, token: string) => {
    try {
        if (!news_id) {
            throw new Error('News ID is required to fetch upvotes.');
        }
        const response = await axios.delete(`http://localhost:4000/api/upvotes/${news_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error(`${error.message}: Error retrieving upvotes.`);
        throw new Error(error.response?.data?.message || 'Failed to fetch upvotes.');
    }
}
