import { FC, useEffect, useState, useCallback } from 'react';
import { PromptDeleteProps, NewsDisplayProps, NewsProps } from '../interfaces/newsInterface';
import { FilterDropdownProps } from '../interfaces/tagInterface';
import { fetchNews, searchNews } from '../services/newsService';
import { useUserContext } from '../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import { LoaderIcon } from './Icons/LoaderIcon';
import { SearchBar } from './SearchBar';
import { ArticleCard } from './ArticleCard';
import { deleteNews } from '../services/newsService';
import { showToast } from '../utils/toast';
import { Tag } from '../interfaces/tagInterface';


export const Explore = () => {
    const [newsList, setNewsList] = useState<NewsProps['news'][]>([]);
    const [noResults, setNoResults] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();
    const { userState } = useUserContext();
    const token = userState.token;
    const user_id = userState.user?.user_id;

    const loadNews = useCallback(async () => {
        try {
            const news = await fetchNews(token, user_id, true, page);
            if (news.length === 0) {
                setHasMore(false);
            } else {
                setNewsList((prevNews) => [...prevNews, ...news]);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || "An unexpected error occurred.");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }, [token, page]);

    const handleSearch = async (query: string, tags: Tag[]) => {
        try {
            console.log("sentover", query, tags);
            setSearchQuery(query);
            setSelectedTags(tags);
            setLoading(true);
            const TagIds = tags.map((tag) => tag.tag_id);
            const news = await searchNews(query, TagIds);
            setNewsList(news);
            setNoResults(news.length === 0);
            setHasMore(false);
            setHasSearched(true);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || "An unexpected error occurred.");
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (newsToDelete === null) return;
        try {
            await deleteNews(newsToDelete, token);
            showToast("success", "News deleted successfully.");
            setNewsList([]);
            loadNews();
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast("error", `${(error as Error).message}: Error deleting news.`);
            } else {
                showToast("error", "Error deleting news.");
            }
        } finally {
            setShowDeleteModal(false);
            setNewsToDelete(null);
        }
    };

    const confirmDelete = (news_id: number) => {
        setNewsToDelete(news_id);
        setShowDeleteModal(true);
    };

    const handleScroll = useCallback(() => {
        if (loading || !hasMore) return;

        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 50) { // Subtracting 50px to trigger load before reaching the bottom
            setPage((prevPage) => prevPage + 1);
        }
    }, [loading, hasMore]);

    const handleBack = () => {
        setHasSearched(false);
        setPage(1);
        setNewsList([]);
        setHasMore(true);
        loadNews();
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (hasMore) {
            loadNews();
        }
    }, [page, hasMore, loadNews]);

    if (loading && page === 1) {
        return <LoaderIcon />;
    }

    if (error) {
        return <div className="min-h-screen bg-base-200 text-red-500 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-base-300">
            {showDeleteModal && (
                <PromptDelete
                    onDelete={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
            <MainSection
                newsList={newsList}
                noResults={noResults}
                loading={loading}
                hasMore={hasMore}
                hasSearched={hasSearched}
                onConfirmDelete={confirmDelete}
                onSearch={handleSearch}
                searchQuery={searchQuery}
                selectedTags={selectedTags}
                onNavigate={() => navigate(userState.token ? '/dashboard' : '/signup')}
                handleBack={handleBack}
            />
        </div>
    );
};

const PromptDelete = ({ onDelete, onCancel }: PromptDeleteProps) => (
    <div className="modal modal-open">
        <div className="modal-box">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <p className="py-4 font-bold text-md">Are you sure you want to delete this article?</p>
            <div className="modal-action">
                <button className="btn btn-neutral text-white rounded-lg" onClick={onDelete}>Delete</button>
                <button className="btn rounded-lg" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    </div>
);

const MainSection = ({
    newsList,
    noResults,
    loading,
    hasMore,
    hasSearched,
    onConfirmDelete,
    onSearch,
    searchQuery,
    selectedTags,
    onNavigate,
    handleBack
}: NewsDisplayProps) => {
    return (
        <div id="explore" className="min-h-screen bg-base-200 px-32 py-16">
            <HeaderSection />
            <SearchSection onSearch={onSearch} onNavigate={onNavigate} hasSearched={hasSearched} handleBack={handleBack} searchQuery={searchQuery} selectedTags={selectedTags} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsList.length === 0 ? (
                    <div className="bg-base-100 rounded-lg p-16 text-center">
                        {noResults ? (
                            <p className="text-2xl text-base-content font-bold mb-4">
                                No articles found matching your search.
                            </p>
                        ) : (
                            <p className="text-2xl text-base-content font-semibold">
                                There are currently no news available.
                            </p>
                        )}
                    </div>
                ) : (
                    newsList.map((news) =>
                        <ArticleCard
                            key={news.news_id}
                            {...news}
                            onDelete={() => onConfirmDelete(news.news_id)}
                        />)
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <LoaderIcon />
                </div>
            ) : !hasMore && (
                <div className="text-center py-16 text-gray-500 font-semibold">
                    You have reached the end.
                </div>
            )}
        </div>
    );
};

const HeaderSection = () => (
    <div>
        <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-base-content">Explore</h2>
            <p className="text-lg font-semibold text-base-content my-4">
                Discover articles, share ideas, and connect with a community of like-minded individuals.
            </p>
        </div>

        <div className="w-full h-[0.1rem] bg-red-800" />
    </div>
)

const SearchSection: FC<FilterDropdownProps> = ({ onSearch, onNavigate, hasSearched, handleBack, searchQuery, selectedTags }) => {
    return (
        <div className="flex justify-between items-center my-10">
            <div className="flex items-center gap-2">
                <SearchBar onSearch={onSearch} searchQuery={searchQuery} selectedTags={selectedTags} />
                {hasSearched && (
                    <div className='justify-end gap-4 flex'>
                        <button
                            className="btn btn-secondary rounded-lg"
                            onClick={handleBack}
                        >
                            Back
                        </button>
                    </div>
                )}
            </div>
            <div className="flex gap-4">
                <button
                    onClick={onNavigate}
                    className="btn btn-primary rounded-lg font-semibold"
                >
                    My Articles
                </button>
            </div>
        </div>
    );
};