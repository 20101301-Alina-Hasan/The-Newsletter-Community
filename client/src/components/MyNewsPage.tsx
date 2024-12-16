/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../interfaces/userInterfaces';
import { UserContextType } from '../interfaces/userInterfaces';
import { useNavigate } from 'react-router-dom';
import { MyNewsCard } from './MyNewsCard';
import { NewsProps } from '../interfaces/newsInterface';
import { fetchUserNews } from '../services/newsService';
import { FilterDropdown } from './FilterDropdown';
import { showToast } from '../utils/toast';
import Cookies from 'js-cookie';
import axios from 'axios';

export const MyNewsPage = () => {
    const { userState } = useContext(UserContext) as UserContextType;
    const [newsList, setNewsList] = useState<NewsProps['news'][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadNews = async () => {
            try {
                const user_id = userState.user?.user_id;
                const news = await fetchUserNews(user_id);
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


    const handleDelete = async (news_id: number) => {
        try {
            const token = Cookies.get("access_token");
            await axios.delete(`http://localhost:3000/api/news/${news_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            showToast("success", "News deleted successfully.");
            setNewsList((prev) => prev.filter((news) => news.news_id !== news_id));
        } catch (error: any) {
            showToast("error", `${error.message}: Error deleting news.`);
        }
    };

    if (loading) {
        return <div className='min-h-screen bg-base-200 text-2xl text-base-content font-semibold'>Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-base-200 text-red-500 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-base-200">
            <div className="bg-base-300 border-b border-base-200 py-8">
                <div className="container mx-auto px-32">
                    <div className="flex items-center gap-4">
                        <div className="space-y-2">
                            <h1 className="pt-4 text-4xl font-semibold font-serif text-base-content">Welcome
                                <span className="font-extrabold"> {userState.user?.name}</span>
                            </h1>
                            <p className="text-md text-base-content/70">@{userState.user?.username}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-32 py-8">

                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-base-content">My Articles</h2>
                    <p className="text-lg font-semibold text-base-content my-4">
                        Publish your articles, polish older ones, and connect with a community of like-minded individuals.
                    </p>
                </div>

                <div className="w-full h-[0.1rem] bg-red-800" />

                <div className="flex justify-between items-center pb-6 my-10">
                    <FilterDropdown />
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/create')}
                            className="btn btn-primary"
                        >
                            Create Article
                        </button>
                        {userState.token ? <button
                            onClick={() => navigate('/')}
                            className="btn btn-secondary"
                        >
                            Explore
                        </button> : null}

                    </div>
                </div>

                {newsList.length === 0 ? (
                    <div className="bg-base-100 rounded-lg p-8 text-center">
                        <p className='text-2xl text-base-content font-semibold mb-4'>
                            You have yet to publish an article.
                            <br />
                            <strong className='text-secondary'>Create one now</strong> and contribute to the community
                        </p>
                        <button
                            className="btn btn-primary font-bold"
                            onClick={() => navigate('/create')}
                        >
                            Publish Your First Article
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsList.map((news) => (
                            <MyNewsCard key={news.news_id} {...news} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

