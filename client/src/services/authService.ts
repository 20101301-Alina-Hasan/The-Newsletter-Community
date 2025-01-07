// import Cookies from 'js-cookie';
import axios from 'axios';

export const fetchUser = async (token: string) => {
    try {
        const response = await axios.get('http://localhost:4000/api/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("me", response.data.user, response.status)
        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        if (err.response && err.response.data) {
            throw new Error(err.response.data.message);
        } else {
            throw new Error('An unexpected error occurred. Please try again later.');
        }
    }
}

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post('http://localhost:4000/api/users/login', {
            email,
            password,
        });
        if (response.status === 200) {
            const { token } = response.data;
            // Cookies.set('access_token', token, { expires: 30 });
            localStorage.setItem('access_token', token);
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
        const response = await axios.post('http://localhost:4000/api/users/signup', {
            name,
            username,
            email,
            password,
        });
        if (response.status === 201) {
            const { token } = response.data;
            // Cookies.set('access_token', token, { expires: 30 });
            localStorage.setItem('access_token', token);
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