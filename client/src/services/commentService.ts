/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
// import Cookies from 'js-cookie';
// import { CommentsProps } from '../interfaces/commentsInterface';

export const fetchComments = async (news_id: number) => {
    if (!news_id) {
        throw new Error('News ID is required to fetch comments.');
    }

    try {
        const response = await axios.get(`http://localhost:3000/api/comments/${news_id}`);
        console.log("Comment Response:", response.data);
        return response.data.comments || [];
    } catch (error: any) {
        console.error(`${error.message}: Error retrieving comments.`);
        throw new Error(error.response?.data?.message || 'Failed to fetch comments.');
    }
};



// export const createNews = async (formData: FormData) => {
//     try {
//         const token = Cookies.get('access_token');
//         const response = await axios.post('http://localhost:3000/api/news/', formData, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error creating article:', error);
//         throw error;
//     }
// };

// export const updateNews = async (formData: FormData, news_id: number) => {
//     try {
//         const token = Cookies.get('access_token');
//         const response = await axios.put(`http://localhost:3000/api/news/${news_id}`, formData, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error creating article:', error);
//         throw error;
//     }
// }