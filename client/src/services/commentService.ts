/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const fetchComments = async (news_id: number) => {
    try {
        if (!news_id) {
            throw new Error('News ID is required to fetch comments.');
        }
        const response = await axios.get(`http://localhost:3000/api/comments/${news_id}`);
        return response.data.comments || [];
    } catch (error: any) {
        console.error(`${error.message}: Error retrieving comments.`);
        throw new Error(error.response?.data?.message || 'Failed to fetch comments.');
    }
};

export const addComment = async (news_id: number, comment: string, token: string) => {
    try {
        if (!news_id || !comment) {
            throw new Error('All fields (news_id, user_id and comment) are required.');
        }
        const response = await axios.post(`http://localhost:3000/api/comments/${news_id}`, { comment }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error(`${error.message}: Error updating the comment.`);
        throw new Error(error.response?.data?.message || 'Failed to update the comment.');
    }
};

export const editComment = async (comment_id: number, editedComment: string, token: string) => {
    try {
        if (!comment_id || !editedComment) {
            throw new Error('All parameters (news_id, comment_id, updatedComment) are required.');
        }
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

        return response.data;
    } catch (error: any) {
        console.error(`${error.message}: Error updating the comment.`);
        throw new Error(error.response?.data?.message || 'Failed to update the comment.');
    }
};

export const deleteComment = async (comment_id: number, token: string) => {
    try {
        if (!comment_id) {
            throw new Error('comment_id is required.');
        }
        const response = await axios.delete(`http://localhost:3000/api/comments/${comment_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error(`${error.message}: Error deleting the comment.`);
        throw new Error(error.response?.data?.message || 'Failed to delete the comment.');
    }
};


