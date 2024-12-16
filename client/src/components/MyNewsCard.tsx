/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { NewsView } from "./NewsView";
import { NewsProps } from "../interfaces/newsInterface";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import Cookies from 'js-cookie';
import axios from "axios";
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { DetailCountBar } from "./DetailCountBar";

export function MyNewsCard({
    news_id,
    title,
    releaseDate,
    description,
    thumbnail,
    upvotes,
    commentCount,
    tags,
    username
}: NewsProps["news"]) {
    const [isNewsOpen, setIsNewsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const token = Cookies.get('access_token');
            await axios.delete(`http://localhost:3000/api/news/${news_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            showToast('success', 'Your article has been removed.');
            navigate('/');
        } catch (error: any) {
            showToast('error', `${error.message}: An error occurred while deleting the news.`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div
                onClick={() => setIsNewsOpen(true)}
                className="card bg-base-200 border-[1px] border-gray-500 hover:border-primary hover:border-[2px] hover:bg-base-100 transition-color cursor-pointer"
            >
                <figure className="relative">
                    <img
                        src={thumbnail ? thumbnail : "public/default-image.png"}
                        alt={title}
                        className="w-full h-64 object-cover object-center"
                    />
                </figure>
                <div className="absolute top-2 right-2 dropdown dropdown-hover">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-circle btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreVertical className="w-6 h-6 text-base-content hover:text-primary transition-colors" />
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <li>
                            <button
                                className="flex items-center w-full text-left"
                                onClick={() => navigate('/edit', {
                                    state: {
                                        news_id,
                                        title,
                                        releaseDate,
                                        description,
                                        thumbnail,
                                        tags
                                    }
                                })}
                            >
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </button>
                        </li>
                        <li>
                            <button
                                className="flex items-center w-full text-left text-red-600"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                <Trash className="h-4 w-4 mr-2" /> {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-2">
                            <h2 className="card-title font-serif">{title}</h2>
                            <div className="flex items-center gap-2 text-sm py-2">
                                <span>{releaseDate}</span>
                                <span className="ml-1 w-[0.1rem] h-[1.2rem] bg-amber-400" />
                                <span className="font-semibold">@{username}</span>
                            </div>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {tags.slice(0, 3).map((tag: string, index: number) => (
                                    <div
                                        key={index}
                                        className="badge badge-outline badge-md font-semibold"
                                    >
                                        #{tag}
                                    </div>
                                ))}
                                {tags.length > 3 && (
                                    <div className="badge badge-outline badge-md font-semibold">
                                        +{tags.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DetailCountBar />

                </div>
            </div>

            <NewsView
                isOpen={isNewsOpen}
                onClose={() => setIsNewsOpen(false)}
                news={{
                    news_id,
                    title,
                    releaseDate,
                    description,
                    thumbnail,
                    upvotes,
                    commentCount,
                    tags,
                    username,
                }}
            />
        </>
    );
}

