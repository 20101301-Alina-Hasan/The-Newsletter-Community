/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchComments = async (news_id: number) => {
    try {
        if (!news_id) {
            throw new Error('News ID is required to fetch comments.');
        }
        const response = await axios.get(`http://localhost:3000/api/comments/${news_id}`);
        console.log("Comment Response:", response.data);
        return response.data.comments || [];
    } catch (error: any) {
        console.error(`${error.message}: Error retrieving comments.`);
        throw new Error(error.response?.data?.message || 'Failed to fetch comments.');
    }
};

export const addComment = async (news_id: number, user_id: number | undefined, comment: string) => {
    try {
        if (!news_id || !user_id || !comment) {
            throw new Error('All fields (news_id, user_id and comment) are required.');
        }
        const token = Cookies.get('access_token');
        const commentData = {
            user_id,
            comment,
        }
        console.log(commentData)
        const response = await axios.post(`http://localhost:3000/api/comments/${news_id}`, commentData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Add Comment Response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error(`${error.message}: Error updating the comment.`);
        throw new Error(error.response?.data?.message || 'Failed to update the comment.');
    }
};

export const editComment = async (comment_id: number, editedComment: string) => {
    try {
        if (!comment_id || !editedComment) {
            throw new Error('All parameters (news_id, comment_id, updatedComment) are required.');
        }
        const token = Cookies.get('access_token');
        const commentData = {
            comment_id,
            comment: editedComment,
        }
        console.log(commentData)
        const response = await axios.put(`http://localhost:3000/api/comments/${comment_id}`, commentData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Edit Comment Response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error(`${error.message}: Error updating the comment.`);
        throw new Error(error.response?.data?.message || 'Failed to update the comment.');
    }
};

export const deleteComment = async (comment_id: number) => {
    try {
        if (!comment_id) {
            throw new Error('comment_id is required.');
        }
        const token = Cookies.get('access_token');
        const response = await axios.delete(`http://localhost:3000/api/comments/${comment_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Delete Comment Response:', response.data);
        return response.data;
    } catch (error: any) {
        console.error(`${error.message}: Error deleting the comment.`);
        throw new Error(error.response?.data?.message || 'Failed to delete the comment.');
    }
};


