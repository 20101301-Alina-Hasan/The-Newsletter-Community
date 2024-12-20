/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/userContext';
import { MyNewsCard } from './MyNewsCard';
import { NewsProps } from '../interfaces/newsInterface';
import { fetchNews } from '../services/newsService';
import { LoaderIcon } from './Icons/LoaderIcon';
import { HashLink } from 'react-router-hash-link';

export const MyBookmarkPage = () => {
    const [bookmarkedNews, setBookmarkedNews] = useState<NewsProps['news'][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { userState } = useUserContext();
    const token = userState.token;

    const loadBookmarkedNews = async () => {
        try {
            const bookmarks = await fetchNews(undefined, token, false, true);
            console.log(bookmarks);
            setBookmarkedNews(bookmarks);
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookmarkedNews();
    }, []);

    if (loading) {
        return <LoaderIcon />
    }

    if (error) {
        return <div className="min-h-screen bg-base-200 text-red-500 font-semibold">Error: {error}</div>;
    }
    return (
        <div id="bookmarks" className="min-h-screen bg-base-300">
            <div className="container mx-auto px-32 py-16">
                <div className="mb-8">
                    <h2 className="text-4xl font-extrabold text-base-content">My Bookmarks</h2>
                    <p className="text-lg font-semibold text-base-content my-4">
                        View and manage your saved articles. Keep track of content you find interesting and revisit them anytime.
                    </p>
                </div>

                <div className="w-full h-[0.1rem] bg-red-800" />

                <div className="flex justify-between items-center pb-6 my-10">
                    <div className="flex gap-4">
                        <HashLink to="/dashboard#my-articles" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                            <a className="btn btn-primary" >
                                My Articles
                            </a>
                        </HashLink>
                        <HashLink to="/#explore" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                            <a className="btn btn-secondary font-bold">
                                Explore
                            </a>
                        </HashLink>
                    </div>
                </div>

                {bookmarkedNews.length === 0 ? (
                    <div className="bg-base-200 rounded-lg p-16 text-center my-10">
                        <p className="text-2xl text-base-content font-bold mb-4">
                            Nothing booked yet.
                            <br />
                            <span className="text-3xl text-secondary font-extrabold">Let's start exploring</span>
                        </p>
                        <HashLink to="/#explore" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                            <a className="btn btn-primary font-bold">
                                Explore Articles
                            </a>
                        </HashLink>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 my-10">
                        {bookmarkedNews.map((news) => (
                            <MyNewsCard
                                key={news.news_id}
                                {...news}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
