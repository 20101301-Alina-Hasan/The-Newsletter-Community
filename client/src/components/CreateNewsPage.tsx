import React, { useState, useContext, useEffect } from 'react';
import { UserContext, UserContextType } from '../interfaces/User';
import { useNavigate } from 'react-router-dom';
import { createNews } from '../services/news';
import { CreateNewsProps } from '../interfaces/News';
import axios from 'axios';

const tags = [
    'Technology', 'Science', 'Politics', 'Economy', 'Health',
    'Environment', 'Education', 'Sports', 'Entertainment', 'Travel',
    'Food', 'Fashion', 'Art', 'Music', 'Literature',
    'History', 'Philosophy', 'Religion', 'Social Issues', 'Innovation',
];

export function CreateNewsPage({ isOpen, onClose }: CreateNewsProps) {
    const { userState } = useContext(UserContext) as UserContextType;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userState.token) {
            navigate('/');
        }
    }, [userState.token, navigate]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'news_thumbnail_preset');

        try {
            setIsUploading(true);
            const response = await axios.post('https://api.cloudinary.com/v1_1/dganhxhid/image/upload', formData);
            setIsUploading(false);
            return response.data.secure_url;
        } catch (error) {
            console.error('Image upload failed:', error);
            setIsUploading(false);
            throw new Error('Image upload failed');
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const url = await uploadToCloudinary(file);
                setThumbnail(file);
                setThumbnailUrl(url);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setError('Failed to upload image. Please try again.');
            }
        }
    };

    const handleThumbnailRemove = () => {
        setThumbnail(null);
        setThumbnailUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Make thumbnailUrl and tags optional
        if (!title || !description) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('releaseDate', new Date().toISOString());
            formData.append('description', description);
            if (thumbnailUrl) formData.append('thumbnail', thumbnailUrl);
            selectedTags.forEach((tag) => formData.append('tags[]', tag));

            // Submit the form data to your backend
            await createNews(formData);

            // Clear fields after successful submission
            setTitle('');
            setDescription('');
            setThumbnail(null);
            setThumbnailUrl(null);
            setSelectedTags([]);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to create article. Please try again.');
        }
    };

    return (
        <>
            {isOpen && (
                <div className="modal modal-open flex items-center justify-center">
                    <div className="modal-box w-full max-w-2xl p-8 bg-base-100 rounded-lg shadow-md">
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                className="btn btn-sm btn-circle"
                            >
                                ✕
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-center mt-2 mb-8 text-base-content">Create New Article</h1>
                        {error && (
                            <div className="bg-red-50 text-red-600 border border-red-400 rounded px-4 py-2 mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-base-content mb-2">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    placeholder="e.g. What is Lorem Ipsum?"
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-base-300 text-white w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-base-content mb-2">Content</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={10}
                                    cols={50}
                                    className="bg-base-300 text-white w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="thumbnail" className="block text-sm font-medium text-base-content mb-2">Thumbnail</label>
                                <input
                                    type="file"
                                    id="thumbnail"
                                    onChange={handleThumbnailUpload}
                                    className="mt-1 w-full text-gray-400 file:py-2 file:px-4 file:bg-indigo-50 file:text-indigo-600 file:rounded-md hover:file:bg-indigo-100"
                                    accept="image/*"
                                />
                                {isUploading && <p>Uploading image...</p>}
                                {thumbnailUrl && (
                                    <div className="mt-4 flex items-center">
                                        <img src={thumbnailUrl} alt="Thumbnail preview" className="w-20 h-20 rounded-lg shadow-md" />
                                        <button
                                            type="button"
                                            onClick={handleThumbnailRemove}
                                            className="btn btn-sm btn-circle ml-4 text-red-600 hover:text-red-800 hover:bg-red-500"
                                        >
                                            X
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-base-content mb-2">Tags</span>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleTagToggle(tag)}
                                            className={`px-3 py-1 text-sm rounded-full transition border-2 ${selectedTags.includes(tag)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-black hover:bg-gray-300'
                                                }`}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center py-4">
                                <button
                                    type="submit"
                                    className="btn bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Publish My Article
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
