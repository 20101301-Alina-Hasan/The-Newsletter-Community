import { useEffect, useState } from 'react';
import { useUserContext } from '../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { MyBookmarks } from './MyBookmarks';
import { NewsProps } from '../interfaces/newsInterface';
import { deleteNews, fetchNews, searchNews } from '../services/newsService';
import { HashLink } from 'react-router-hash-link';
import { LoaderIcon } from './Icons/LoaderIcon';
import { showToast } from '../utils/toast';
import { ArticleCard } from './ArticleCard';
import { Tag } from '../interfaces/tagInterface';

export const MyArticles = () => {
    const [newsList, setNewsList] = useState<NewsProps['news'][]>([]);
    const [noResults, setNoResults] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
    const { userState } = useUserContext();
    const token = userState.token;
    const user_id = userState.user?.user_id;

    const loadNews = async () => {
        try {
            const news = await fetchNews(token, user_id);
            setNewsList(news);
            setNoResults(false);
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

    useEffect(() => {
        if (token) loadNews();
    }, [token, user_id]);

    const handleSearch = async (query: string, tags: Tag[]) => {
        try {
            setSearchQuery(query);
            setSelectedTags(tags);
            setLoading(true);
            const TagIds = tags.map((tag) => tag.tag_id);
            const news = await searchNews(query, TagIds, token);
            setNoResults(news.length === 0);
            setNewsList(news);
            setHasSearched(true);
        } catch (error: unknown) {
            console.error("Error searching news:", error);
            if (error instanceof Error) {
                setError(error.message || "An unexpected error occurred during search.");
            } else {
                setError("An unexpected error occurred during search.");
            }
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (news_id: number) => {
        setNewsToDelete(news_id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (newsToDelete === null) return;
        try {
            await deleteNews(newsToDelete, token);
            showToast("success", "You article has been deleted successfully.");
            setNewsList((prev) => prev.filter((news) => news.news_id !== newsToDelete));
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



    if (loading) {
        return <LoaderIcon />;
    }

    if (error) {
        return <ErrorScreen error={error} />;
    }

    return (
        <div id="my-articles" className="min-h-screen bg-base-300">
            {showDeleteModal && (
                <PromptDelete
                    onDelete={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
            <WelcomeSection username={userState.user?.name} />
            <MainSection
                newsList={newsList}
                noResults={noResults}
                onSearch={handleSearch}
                hasSearched={hasSearched}
                setHasSearched={setHasSearched}
                onConfirmDelete={confirmDelete}
                loadNews={loadNews}
                searchQuery={searchQuery}
                selectedTags={selectedTags}
            />
            <MyBookmarks />
        </div>
    );
};

const PromptDelete = ({ onDelete, onCancel }: { onDelete: () => void; onCancel: () => void }) => (
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

const WelcomeSection = ({ username }: { username?: string }) => (
    <div className="bg-base-300 border-b border-base-200 py-16">
        <div className="container mx-auto px-32">
            <div className="flex flex-col items-center gap-4 text-center">
                <h1 className="pt-4 text-5xl font-serif text-base-content">
                    Welcome, <span className="font-extrabold">{username}</span>
                </h1>
                <p className="text-lg text-base-content/70 mt-4">
                    We're excited to have you here! Explore and create new articles, connect with others, and contribute to the community.
                </p>
            </div>
        </div>
    </div>
);

const HeaderSection = () => (
    <div><div className="mb-8">
        <h2 className="text-4xl font-extrabold text-base-content">My Articles</h2>
        <p className="text-lg font-semibold text-base-content my-4">
            Publish your articles, polish older ones, and encounter like-minded individuals.
        </p>
    </div>
        <div className="w-full h-[0.1rem] bg-red-800" /></div>
);


interface SearchSectionProps {
    onSearch: (query: string, tags: Tag[]) => void;
    loadNews: () => void;
    hasSearched: boolean;
    setHasSearched: (value: boolean) => void;
    searchQuery: string;
    selectedTags: Tag[];
}

const SearchSection = ({ onSearch, loadNews, hasSearched, setHasSearched, searchQuery, selectedTags }: SearchSectionProps) => {
    const navigate = useNavigate();
    const handleBack = () => {
        setHasSearched(false);
        loadNews();
    };
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
                <button onClick={() => navigate('/create')} className="btn btn-primary rounded-lg">
                    Create Article
                </button>
                <HashLink to="/dashboard#bookmarks" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                    <a className="btn btn-neutral rounded-lg h-12">
                        Bookmarks
                    </a>
                </HashLink>
                <button onClick={() => navigate('/')} className="btn btn-secondary rounded-lg font-bold">
                    Explore
                </button>
            </div>
        </div>
    );
};

interface ContentGridProps {
    newsList: NewsProps['news'][];
    noResults: boolean;
    loadNews: () => void;
    onConfirmDelete: (news_id: number) => void;
}

const ContentGrid = ({ newsList, noResults, loadNews, onConfirmDelete }: ContentGridProps) => (
    noResults ? (
        <NoResults loadNews={loadNews} />
    ) : newsList.length === 0 ? (
        <NoArticles />
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {newsList.map((news: NewsProps["news"]) => (
                <ArticleCard
                    key={news.news_id}
                    {...news}
                    onDelete={() => onConfirmDelete(news.news_id)}
                />
            ))}
        </div>
    )
);

const NoResults = ({ loadNews }: { loadNews: () => void }) => {
    return (
        <div className="bg-base-100 rounded-lg p-16 text-center">
            <p className="text-2xl text-base-content font-bold m-4">
                You have no articles published matching your search query.
            </p>
            <button
                className="btn btn-primary font-bold m-2"
                onClick={() => { loadNews() }}
            >
                Return
            </button>
        </div>
    );
};

const NoArticles = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-base-100 rounded-lg p-16 text-center">
            <p className="text-2xl text-base-content font-bold m-4">
                You have yet to publish an article.
                <br />
                <span className="text-3xl text-secondary font-extrabold">Create one now</span> and contribute to the community.
            </p>
            <button
                className="btn btn-primary font-bold m-2"
                onClick={() => navigate('/create')}
            >
                Publish Your First Article
            </button>
        </div>
    );
};

const ErrorScreen = ({ error }: { error: string }) => (
    <div className="min-h-screen bg-base-200 text-red-500 font-semibold">
        Error: {error}
    </div>
);

const MainSection = ({
    onSearch,
    newsList,
    noResults,
    hasSearched,
    setHasSearched,
    selectedTags,
    searchQuery,
    loadNews,
    onConfirmDelete,
}: {
    onSearch: (query: string, tags: Tag[]) => void;
    newsList: NewsProps['news'][];
    noResults: boolean;
    hasSearched: boolean;
    setHasSearched: (value: boolean) => void;
    selectedTags: Tag[];
    searchQuery: string;
    loadNews: () => void;
    onConfirmDelete: (news_id: number) => void;
}) => {
    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-32 py-16">
                <HeaderSection />
                <SearchSection
                    onSearch={onSearch}
                    loadNews={loadNews}
                    hasSearched={hasSearched}
                    setHasSearched={setHasSearched}
                    selectedTags={selectedTags}
                    searchQuery={searchQuery} />
                <ContentGrid
                    newsList={newsList}
                    noResults={noResults}
                    loadNews={loadNews}
                    onConfirmDelete={onConfirmDelete}
                />
            </div>
        </div>
    );
};


