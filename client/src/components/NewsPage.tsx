import { useEffect, useState } from 'react';
import { NewsCard } from "./NewsCard";
import { NewsProps } from '../interfaces/newsInterface';
import { fetchAllNews } from '../services/newsService';

export const NewsPage = () => {
    const [newsList, setNewsList] = useState<NewsProps['news'][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const news = await fetchAllNews();
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
