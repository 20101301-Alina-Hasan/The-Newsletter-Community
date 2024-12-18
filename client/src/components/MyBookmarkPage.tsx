/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyNewsCard } from './MyNewsCard';
import { NewsProps } from '../interfaces/newsInterface';
import { fetchNews } from '../services/newsService';
import { LoaderIcon } from './Icons/LoaderIcon';
import Cookies from 'js-cookie';



export const MyBookmarkPage = () => {
    const [bookmarkedNews, setBookmarkedNews] = useState<NewsProps['news'][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const token = Cookies.get('access_token');
    const navigate = useNavigate();

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
            <div className="container mx-auto px-32 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-base-content">My Bookmarks</h2>
                    <p className="text-lg font-semibold text-base-content my-4">
                        View and manage your saved articles. Keep track of content you find interesting and revisit them anytime.
                    </p>
                </div>

                <div className="w-full h-[0.1rem] bg-red-800" />

                {bookmarkedNews.length === 0 ? (
                    <div className="bg-base-200 rounded-lg p-16 text-center my-10">
                        <p className="text-2xl text-base-content font-bold mb-4">
                            Nothing booked yet.
                            <br />
                            <span className="text-3xl text-secondary font-extrabold">Let's start exploring</span>

                        </p>
                        <button
                            className="btn btn-primary font-bold"
                            onClick={() => navigate('/')}
                        >
                            Explore Articles
                        </button>
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
