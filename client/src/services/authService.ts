import Cookies from 'js-cookie';
import axios from 'axios';

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post('http://localhost:3000/api/users/login', {
            email,
            password,
        });

        if (response.status === 200) {
            const { token } = response.data;
            Cookies.set('access_token', token, { expires: 30 });
            return response.data;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        if (err.response && err.response.data) {
            throw new Error(err.response.data.message);
        } else {
            throw new Error('An unexpected error occurred. Please try again later.');
        }
    }
};

export const registerUser = async (name: string, username: string, email: string, password: string) => {
    try {
        const response = await axios.post('http://localhost:3000/api/users/signup', {
            name,
            username,
            email,
            password,
        });

        if (response.status === 201) {
            const { token } = response.data;
            Cookies.set('access_token', token, { expires: 30 });
            return response.data;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        if (err.response && err.response.data) {
            throw new Error(err.response.data.message);
        } else {
            throw new Error('An unexpected error occurred. Please try again later.');
        }
    }
}