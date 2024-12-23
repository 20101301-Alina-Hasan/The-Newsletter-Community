import { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/userContext';
import { NewsProps } from '../interfaces/newsInterface';
import { deleteNews, fetchNewsByBookmark } from '../services/newsService';
import { HashLink } from 'react-router-hash-link';
import { ArticleCard } from './ArticleCard';
import { LoaderIcon } from './Icons/LoaderIcon';
import { showToast } from '../utils/toast';

interface BookmarkListProps {
    news: NewsProps['news'][];
    onDelete: (newsId: number) => void;
}

export const BookmarkList = ({ news, onDelete }: BookmarkListProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 my-10">
        {news.map((newsItem) => (
            <ArticleCard
                key={newsItem.news_id}
                {...newsItem}
                onDelete={() => onDelete(newsItem.news_id)} // Pass the delete function
            />
        ))}
    </div>
);

export const Loader = () => (
    <div className="flex justify-center items-center">
        <LoaderIcon />
    </div>
);

const ErrorScreen = ({ error }: { error: string }) => (
    <div className="min-h-screen bg-base-200 text-red-500 font-semibold">
        Error: {error}
    </div>
);

export const NoArticles = () => (
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
);

export const Navigation = () => (
    <div className="flex justify-between items-center pb-6 my-10">
        <div className="flex gap-4">
            <HashLink to="/dashboard#my-articles" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                <a className="btn btn-primary rounded-lg">
                    My Articles
                </a>
            </HashLink>
            <HashLink to="/#explore" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                <a className="btn btn-secondary rounded-lg font-bold">
                    Explore
                </a>
            </HashLink>
        </div>
    </div>
);

export const MyBookmarks = () => {
    const [bookmarkedNews, setBookmarkedNews] = useState<NewsProps['news'][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
    const { userState } = useUserContext();
    const token = userState.token;

    const confirmDelete = (news_id: number) => {
        setNewsToDelete(news_id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (newsToDelete === null) return;
        try {
            await deleteNews(newsToDelete, token);
            showToast("success", "Bookmark deleted successfully.");
            setBookmarkedNews((prev) => prev.filter((news) => news.news_id !== newsToDelete));
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast("error", `${(error as Error).message}: Error deleting bookmark.`);
            } else {
                showToast("error", "Error deleting bookmark.");
            }
        } finally {
            setShowDeleteModal(false);
            setNewsToDelete(null);
        }
    };

    useEffect(() => {
        const loadBookmarkedNews = async () => {
            try {
                const bookmarks = await fetchNewsByBookmark(token);
                setBookmarkedNews(bookmarks);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message || 'An unexpected error occurred.');
                } else {
                    setError('An unexpected error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadBookmarkedNews();
    }, [token]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <ErrorScreen error={error} />;
    }

    return (
        <div id="bookmarks" className="min-h-screen bg-base-300">
            {showDeleteModal && (
                <PromptDelete
                    onDelete={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
            <div className="container mx-auto px-32 py-16">
                <div className="mb-8">
                    <h2 className="text-4xl font-extrabold text-base-content">My Bookmarks</h2>
                    <p className="text-lg font-semibold text-base-content my-4">
                        View and manage your saved articles. Keep track of content you find interesting and revisit them anytime.
                    </p>
                </div>

                <div className="w-full h-[0.1rem] bg-red-800" />

                <Navigation />

                {bookmarkedNews.length === 0 ? (
                    <NoArticles />
                ) : (
                    <BookmarkList news={bookmarkedNews} onDelete={confirmDelete} />
                )}
            </div>
        </div>
    );
};

const PromptDelete = ({ onDelete, onCancel }: { onDelete: () => void; onCancel: () => void }) => (
    <div className="modal modal-open">
        <div className="modal-box">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p className="py-4 font-bold text-md">Are you sure you want to delete this bookmark?</p>
            <div className="modal-action">
                <button className="btn btn-neutral text-white rounded-lg" onClick={onDelete}>Delete</button>
                <button className="btn rounded-lg" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    </div>
);
