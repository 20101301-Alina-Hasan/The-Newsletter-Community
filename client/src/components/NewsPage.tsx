import { useEffect, useState } from 'react';
import { NewsCard } from "./NewsCard";
import { NewsProps } from '../interfaces/News';

interface NewsPageProps {
    fetchNewsFunction: () => Promise<NewsProps['news'][]>;
    emptyMessage: string;
    errorMessage?: string;
}

export const NewsPage = ({ fetchNewsFunction, emptyMessage, errorMessage }: NewsPageProps) => {
    const [newsList, setNewsList] = useState<NewsProps['news'][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const news = await fetchNewsFunction();
                setNewsList(news);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error("Error loading news:", error);
                setError(error.message || errorMessage || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [fetchNewsFunction, errorMessage]);

    if (loading) {
        return <div className='text-2xl text-base-content font-semibold'>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.length === 0 ? (
                <p className='text-2xl text-base-content font-semibold'>{emptyMessage}</p>
            ) : (
                newsList.map((news) => (
                    <NewsCard key={news.news_id} {...news} />
                ))
            )}
        </div>
    );
};
