/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useUserContext } from '../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import { MyNewsCard } from './MyNewsCard';
import { SearchBar } from './SearchBar';
import { MyBookmarkPage } from './MyBookmarkPage';
import { NewsProps } from '../interfaces/newsInterface';
import { deleteNews, fetchNews, searchNews } from '../services/newsService';
import { HashLink } from 'react-router-hash-link';
import { LoaderIcon } from './Icons/LoaderIcon';
import { showToast } from '../utils/toast';

export const MyNewsPage = () => {
    const [newsList, setNewsList] = useState<NewsProps['news'][]>([]);
    const [noResults, setNoResults] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { userState } = useUserContext();
    const token = userState.token;

    const loadNews = async () => {
        try {
            const news = await fetchNews(undefined, token, false);
            console.log(news);
            setNewsList(news);
            setNoResults(false);
        } catch (error: any) {
            setError(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string, TagIds: number[]) => {
        try {
            setLoading(true);
            const news = await searchNews(query, TagIds, token);
            setNoResults(news.length === 0);
            setNewsList(news);
        } catch (error: any) {
            console.error("Error searching news:", error);
            setError(error.message || "An unexpected error occurred during search.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (news_id: number) => {
        try {
            await deleteNews(news_id);
            showToast("success", "News deleted successfully.");
            setNewsList((prev) => prev.filter((news) => news.news_id !== news_id));
        } catch (error: any) {
            showToast("error", `${error.message}: Error deleting news.`);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

    if (loading) {
        return <LoaderIcon />
    }

    if (error) {
        return <div className="min-h-screen bg-base-200 text-red-500 font-semibold">Error: {error}</div>;
    }

    return (
        <div id="my-articles" className="min-h-screen bg-base-300">
            <div className="bg-base-300 border-b border-base-200 py-16">
                <div className="container mx-auto px-32">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <h1 className="pt-4 text-5xl font-serif text-base-content">
                            Welcome, <span className="font-extrabold">{userState.user?.name}</span>
                        </h1>
                        <p className="text-lg text-base-content/70 mt-4">
                            We're excited to have you here! Explore and create new articles, connect with others, and contribute to the community.
                        </p>
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-base-200">
                <div className="container mx-auto px-32 py-16">
                    <div className="mb-8">
                        <h2 className="text-4xl font-extrabold text-base-content">My Articles</h2>
                        <p className="text-lg font-semibold text-base-content my-4">
                            Publish your articles, polish older ones, and encounter like-minded individuals.
                        </p>
                    </div>

                    <div className="w-full h-[0.1rem] bg-red-800" />

                    <div className="flex justify-between items-center pb-6 my-10">
                        <SearchBar onSearch={handleSearch} />
                        <div className="flex gap-4">
                            <button onClick={() => navigate('/create')} className="btn btn-primary">
                                Create Article
                            </button>
                            <HashLink to="/dashboard#bookmarks" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                                <a className="btn bg-red-700 hover:bg-red-800 text-white h-12" >
                                    Bookmarks
                                </a>
                            </HashLink>
                            <button onClick={() => navigate('/')} className="btn btn-secondary">
                                Explore
                            </button>
                        </div>
                    </div>

                    {noResults ? (
                        <div className="bg-base-100 rounded-lg p-16 text-center">
                            <p className="text-2xl text-base-content font-bold">
                                You did not publish any articles matching your search criteria.
                            </p>
                        </div>
                    ) : newsList.length === 0 ? (
                        <div className="bg-base-100 rounded-lg p-16 text-center">
                            <p className="text-2xl text-base-content font-bold mb-4">
                                You have yet to publish an article.
                                <br />
                                <span className="text-3xl text-secondary font-extrabold">Create one now</span> and contribute to the community.
                            </p>
                            <button
                                className="btn btn-primary font-bold"
                                onClick={() => navigate('/create')}
                            >
                                Publish Your First Article
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                            {newsList.map((news) => (
                                <MyNewsCard key={news.news_id} {...news} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
            <MyBookmarkPage />
        </div>
    );

};

