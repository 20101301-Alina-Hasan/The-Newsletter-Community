import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyNewsCard } from './MyNewsCard';
import { NewsProps } from '../interfaces/newsInterface';
import { fetchUserNews } from '../services/newsService';

export const MyNewsPage = () => {
    const [newsList, setNewsList] = useState<NewsProps['news'][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadNews = async () => {
            try {
                const news = await fetchUserNews();
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

    if (loading) {
        return <div className='min-h-screen bg-base-200 text-2xl text-base-content font-semibold'>Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-base-200 text-red-500 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-base-300 px-32 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsList.length === 0 ? (
                    <div className='space-y-2'>
                        <p className='text-2xl text-base-content font-semibold'>You have yet to publish an article.
                            <br />
                            <strong className='text-secondary'>Create one now</strong> and contribute to the community
                        </p>
                        <a className="btn btn-primary h-12 font-bold" onClick={() => navigate('/create')}>
                            Publish
                        </a>
                    </div>
                ) : (
                    newsList.map((news) => (
                        <MyNewsCard key={news.news_id} {...news} />
                    ))
                )}
            </div>
        </div>
    );
};
