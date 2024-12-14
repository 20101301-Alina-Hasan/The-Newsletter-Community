import { useEffect, useState } from 'react';
import { NewsCard } from "./NewsCard";
import { fetchUserNews } from '../services/news';
import { NewsProps } from '../interfaces/News';

export const MyNewsPage = () => {
    const [newsList, setNewsList] = useState<NewsProps['news'][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // For error messages

    useEffect(() => {
        const loadNews = async () => {
            try {
                const news = await fetchUserNews();
                if (Array.isArray(news)) {
                    setNewsList(news);
                } else {
                    setNewsList([]); // Ensure it's always an array
                }
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
        return <div className='font-semibold'>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.length === 0 ? (
                <p>You haven't posted any articles yet.</p>
            ) : (
                newsList.map((news) => (
                    <NewsCard key={news.news_id} {...news} />
                ))
            )}
        </div>
    );
};
