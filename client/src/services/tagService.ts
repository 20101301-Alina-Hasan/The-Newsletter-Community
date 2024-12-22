/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const fetchTags = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/tags');
        return response.data.tags;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tags.');
    }
};

export const fetchTagByID = async (tag_id: number) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/tags/${tag_id}`);
        // console.log("Response:", response.data.tag.tag);
        return response.data.tag.tag;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tags.');
    }
};