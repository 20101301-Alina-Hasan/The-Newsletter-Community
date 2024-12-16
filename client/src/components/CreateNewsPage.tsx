/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useEffect } from 'react';
import { UserContext, UserContextType } from '../interfaces/userInterfaces';
import { useNavigate } from 'react-router-dom';
import { createNews } from '../services/newsService';
import { showToast } from '../utils/toast';
import { useCloudinaryUpload } from '../utils/cloudinary/upload';
import { tags } from '../mock/mockTags';

export function CreateNewsPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { userState } = useContext(UserContext) as UserContextType;
    const { uploadToCloudinary, isUploading } = useCloudinaryUpload();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userState.token) {
            navigate('/');
        }
    }, [userState.token, navigate]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags((prev) => prev.includes(tag)
            ? prev.filter((t) => t !== tag)
            : [...prev, tag]
        );
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
        setThumbnailUrl('');
        const fileInput = document.getElementById('thumbnail-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!title || !content) {
                showToast('error', 'Please fill in all required fields.');
                return;
            }
            const formData = new FormData();
            formData.append('title', title);
            formData.append('releaseDate', new Date().toISOString());
            formData.append('description', content);
            formData.append('thumbnail', thumbnailUrl);
            selectedTags.forEach((tag) => formData.append('tags[]', tag));
            await createNews(formData);
            setTitle('');
            setContent('');
            setThumbnail(null);
            setThumbnailUrl('');
            setSelectedTags([]);
            showToast('success', 'Congratulations! Your article has been published.');
            navigate('/my-articles');
        } catch (error: any) {
            showToast('error', `${error.message}: An article with this title already exists. Please try another title.`);
        }
    };

    return (
        <div className="fixed inset-0 bg-base-300 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-base-100">
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
                            {tags.map((tag) => (
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
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isUploading}
                        >
                            Publish Article
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/my-articles')}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


