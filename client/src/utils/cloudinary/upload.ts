import { useState } from 'react';
import axios from 'axios';

export function useCloudinaryUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'news_thumbnail_preset');

        try {
            setIsUploading(true);
            const response = await axios.post('https://api.cloudinary.com/v1_1/dganhxhid/image/upload', formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Image upload failed:', error);
            throw new Error('Image upload failed');
        } finally {
            setIsUploading(false);
        }
    };
    return { uploadToCloudinary, isUploading };
}