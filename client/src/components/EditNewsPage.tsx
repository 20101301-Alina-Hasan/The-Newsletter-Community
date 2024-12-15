/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../utils/toast';
import { updateNews } from '../services/newsService';
import { tags as mockTags } from '../mock/mockTags';

export function EditNewsPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const { news_id, title: initialTitle, description: initialDescription, thumbnail: initialThumbnail, tags: initialTags } = location.state || {};

    const [title, setTitle] = useState<string>(initialTitle || '');
    const [content, setContent] = useState<string>(initialDescription || '');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initialThumbnail || null);
    const [selectedTags, setSelectedTags] = useState<string[]>(initialTags || []);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (location.state) {
            setTitle(initialTitle || '');
            setContent(initialDescription || '');
            setThumbnailUrl(initialThumbnail || null);
            setSelectedTags(initialTags || []);
        }
    }, [location.state, initialTitle, initialDescription, initialThumbnail, initialTags]);

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
            } catch (error: any) {
                showToast('error', `${error.message}: Failed to upload image. Please try again.`);
            }
        }
    };

    const handleThumbnailRemove = () => {
        setThumbnail(null);
        setThumbnailUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            showToast('error', 'Please fill in all required fields.');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('releaseDate', new Date().toISOString());
            formData.append('description', content);
            if (thumbnailUrl) formData.append('thumbnail', thumbnailUrl);
            selectedTags.forEach((tag) => formData.append('tags[]', tag));
            await updateNews(formData, news_id);
            showToast('success', 'Your article has been successfully updated.');
            navigate('/');
        } catch (err) {
            console.error(err);
            showToast('error', 'An article with this title already exists. Please try another title.');
        }
    };

    return (
        <div className="fixed inset-0 bg-base-300 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-base-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-base-content">Edit Your Article</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full p-2 border rounded bg-base-200 text-base-content placeholder-base-content/50"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Content"
                            rows={6}
                            className="w-full p-2 border rounded bg-base-200 text-base-content placeholder-base-content/50"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="file"
                            onChange={handleThumbnailUpload}
                            accept="image/*"
                            className="w-full p-2 border rounded bg-base-200 text-base-content"
                        />
                        {isUploading && <p className="text-sm text-base-content/70">Uploading image...</p>}
                        {thumbnailUrl && (
                            <div className="mt-2 flex items-center">
                                <img src={thumbnailUrl} alt="Thumbnail" className="w-20 h-20 object-cover rounded" />
                                <button
                                    type="button"
                                    onClick={handleThumbnailRemove}
                                    className="btn btn-sm btn-circle ml-2 text-red-500 hover:text-red-700 hover:bg-red-400"
                                >
                                    X
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-base-content mb-2">Tags</p>
                        <div className="flex flex-wrap gap-2">
                            {mockTags.map((tag: string) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag)
                                        ? 'bg-primary text-primary-content'
                                        : 'bg-base-200 text-base-content hover:bg-base-300'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="submit" className="btn btn-primary" onClick={() => navigate('/my-articles')}>
                            Save
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
