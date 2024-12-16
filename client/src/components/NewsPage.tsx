/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useContext } from 'react';
import { UserContext, UserContextType } from '../interfaces/userInterfaces';
import { NewsCard } from "./NewsCard";
import { FilterDropdown } from './FilterDropdown';
import { NewsProps } from '../interfaces/newsInterface';
import { fetchAllNews } from '../services/newsService';
import { useNavigate } from 'react-router-dom';

export const NewsPage = () => {
    const { userState, userDispatch } = useContext(UserContext) as UserContextType;
    const [newsList, setNewsList] = useState<NewsProps['news'][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadNews = async () => {
            try {
                console.log('try newspage:', userState.user);
                const user_id = userState.user?.user_id;
                const news = await fetchAllNews(user_id);
                console.log("newspage:", news);
                setNewsList(news);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error("Error loading news:", error);
                setError(error.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, []);

    const handleNavigation = () => {
        if (userState.token) {
            navigate('/my-articles')
        } else {
            navigate('/signup')
        };
    }

    if (loading) {
        return <div className="p-4 font-serif">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-base-200 text-red-500 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-base-200 px-32 py-24">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-base-content">Explore</h2>
                <p className="text-lg font-semibold text-base-content my-4">
                    Discover articles, share ideas, and connect with a community of like-minded individuals.
                </p>
            </div>

            <div className="w-full h-[0.1rem] bg-red-800" />

            <div className="flex justify-between items-center my-10">
                <FilterDropdown />
                <div className="flex gap-4">
                    <button
                        onClick={handleNavigation}
                        className="btn btn-primary"
                    >
                        My Articles
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {newsList.length === 0 ? (
                    <p className='text-2xl text-base-content font-semibold'>There are no news currently available.</p>
                ) : (
                    newsList.map((news) => (
                        <NewsCard key={news.news_id} {...news} />
                    ))
                )}
            </div>
        </div>
    );
};
