/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { showToast } from '../utils/toast';
import { updateNews } from '../services/newsService';
import { useCloudinaryUpload } from '../utils/upload';
import { fetchTags } from '../services/tagService';
import { Search } from 'lucide-react';
import { useUserContext } from '../contexts/userContext';

export function EditNewsPage() {
    const location = useLocation();
    const { news_id, title: initialTitle, description: initialDescription, thumbnail: initialThumbnail, tags: initialTags } = location.state || {};
    const [title, setTitle] = useState<string>(initialTitle);
    const [content, setContent] = useState<string>(initialDescription);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(initialThumbnail);
    const [selectedTags, setSelectedTags] = useState<number[]>(initialTags?.map((tag: { tag_id: number }) => tag.tag_id) || []);
    const [tags, setTags] = useState<{ tag_id: number; tag: string }[]>([]);
    const [tagSearchQuery, setTagSearchQuery] = useState<string>('');
    const { uploadToCloudinary, isUploading } = useCloudinaryUpload();
    const { userState } = useUserContext();
    const token = userState.token;
    const navigate = useNavigate();

    useEffect(() => {
        const loadTags = async () => {
            try {
                const allTags = await fetchTags();
                setTags(allTags);
            } catch (error) {
                console.error('Error fetching tags:', error);
                showToast('error', 'Failed to load tags.');
            }
        };

        loadTags();
    }, []);

    const filteredTags = useMemo(() => {
        return tags.filter(tag => tag.tag.toLowerCase().includes(tagSearchQuery.toLowerCase()));
    }, [tags, tagSearchQuery]);

    const visibleTags = filteredTags.slice(0, 12);

    const handleTagToggle = (tag_id: number) => {
        setSelectedTags((prev) => prev.includes(tag_id)
            ? prev.filter((id) => id !== tag_id)
            : [...prev, tag_id]
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
        e.preventDefault();
        try {
            if (!title || !content) {
                showToast('error', 'Please fill in all required fields.');
                return;
            }
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', content);
            formData.append('thumbnail', thumbnailUrl);
            selectedTags.forEach(tag_id => formData.append('tag_ids[]', String(tag_id)));
            await updateNews(formData, news_id, token);
            showToast('success', 'Your article has been successfully updated.');
            navigate(-1);
        } catch (error: any) {
            showToast('error', `${error.message}: Failed to update article.`);
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
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full p-2 border rounded bg-base-200 text-base-content placeholder-base-content/50"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Content"
                            rows={6}
                            className="w-full p-2 border rounded bg-base-200 text-base-content placeholder-base-content/50"
                            required
                        />
                    </div>
                    <div>
                        <input
                            id="thumbnail-input"
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
                        <div className="relative flex items-center w-full mb-4">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search tags..."
                                value={tagSearchQuery}
                                onChange={(e) => setTagSearchQuery(e.target.value)}
                                className="input input-bordered border-gray-500 border-1 w-sm pl-8 h-8 bg-base-200/50 rounded-full text-sm"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {visibleTags.map((tag) => (
                                <button
                                    key={tag.tag_id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.tag_id)}
                                    className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag.tag_id)
                                        ? 'bg-primary text-primary-content'
                                        : 'bg-base-200 text-base-content hover:bg-base-300'
                                        }`}
                                >
                                    {tag.tag}
                                </button>
                            ))}
                            {filteredTags.length > 12 && (
                                <span className="px-3 py-1 rounded-lg text-sm text-base-content opacity-60 italic">
                                    more...
                                </span>
                            )}
                        </div>
                    </div>
                    {selectedTags.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-base-content mb-2">Selected Tags</p>
                            <div className="flex flex-wrap gap-2">
                                {tags.filter(tag => selectedTags.includes(tag.tag_id)).map((tag) => (
                                    <span
                                        key={tag.tag_id}
                                        className="px-3 py-1 rounded-full text-sm bg-primary text-primary-content"
                                    >
                                        {tag.tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <button type="submit" className="btn btn-primary font-bold" disabled={isUploading}>
                            Save
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

