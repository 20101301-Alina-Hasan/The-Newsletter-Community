// import { useEffect, useState, useCallback } from 'react';
// import { fetchNews, searchNews } from '../services/newsService';
// import { useUserContext } from '../contexts/userContext';
// import { NewsProps } from '../interfaces/newsInterface';
// import { useNavigate } from 'react-router-dom';
// import { SearchBar } from './SearchBar';
// import { LoaderIcon } from './Icons/LoaderIcon';
// import { NewsCard } from "./NewsCard";

// export const NewsPage = () => {
//     const [newsList, setNewsList] = useState<NewsProps['news'][]>([]);
//     const [noResults, setNoResults] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [page, setPage] = useState<number>(1);
//     const [hasMore, setHasMore] = useState<boolean>(true);
//     const navigate = useNavigate();
//     const { userState } = useUserContext();
//     const token = userState.token;

//     const loadNews = async () => {
//         try {
//             const news = await fetchNews(undefined, token, true, false, page);
//             console.log(page, news);
//             if (news.length === 0) {
//                 setHasMore(false);
//             } else {
//                 setNewsList((prevNews) => [...prevNews, ...news]);
//             }
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any) {
//             console.error("Error loading news:", error);
//             setError(error.message || "An unexpected error occurred.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = async (searchQuery: string, selectedTags: number[]) => {
//         try {
//             setLoading(true);
//             const news = await searchNews(searchQuery, selectedTags);
//             setNewsList(news); // Separate states to avoid unnecessary re-renders
//             setNoResults(news.length === 0);
//             setHasMore(false);
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         } catch (error: any) {
//             setError(error.message || "An unexpected error occurred during search.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleNavigation = () => {
//         if (userState.token) {
//             navigate('/dashboard');
//         } else {
//             navigate('/signup');
//         }
//     };

//     const handleScroll = useCallback(() => {
//         if (loading || !hasMore) return;

//         const scrollTop = document.documentElement.scrollTop;
//         const scrollHeight = document.documentElement.scrollHeight;
//         const clientHeight = document.documentElement.clientHeight;

//         if (scrollTop + clientHeight >= scrollHeight) {
//             setPage((prevPage) => prevPage + 1);
//         }
//     }, [loading, hasMore]);

//     useEffect(() => {
//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, [handleScroll]);

//     useEffect(() => {
//         if (hasMore) {
//             loadNews();
//         }
//     }, [page]);

//     if (loading && page === 1) {
//         return <LoaderIcon />;
//     }

//     if (error) {
//         return <div className="min-h-screen bg-base-200 text-red-500 font-semibold">Error: {error}</div>;
//     }

//     return (
//         <div id="explore" className="min-h-screen bg-base-200 px-32 py-16">
//             <div className="mb-8">
//                 <h2 className="text-4xl font-extrabold text-base-content">Explore</h2>
//                 <p className="text-lg font-semibold text-base-content my-4">
//                     Discover articles, share ideas, and connect with a community of like-minded individuals.
//                 </p>
//             </div>

//             <div className="w-full h-[0.1rem] bg-red-800" />

//             <div className="flex justify-between items-center my-10">
//                 <SearchBar
//                     onSearch={handleSearch}
//                 />
//                 <div className="flex gap-4">
//                     <button
//                         onClick={handleNavigation}
//                         className="btn btn-primary rounded-lg font-bold"
//                     >
//                         My Articles
//                     </button>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {!newsList || newsList.length === 0 ? (
//                     <div className="bg-base-100 rounded-lg p-16 text-center">
//                         {noResults ? (
//                             <p className="text-2xl text-base-content font-bold mb-4">
//                                 No articles found matching your search.
//                             </p>
//                         ) : (
//                             <p className="text-2xl text-base-content font-semibold">
//                                 There are currently no news available.
//                             </p>
//                         )}
//                     </div>
//                 ) : (
//                     newsList.map((news) => <NewsCard key={news.news_id} {...news} />)
//                 )}
//             </div>

//             {loading ? (
//                 <div className="flex justify-center py-8">
//                     <LoaderIcon />
//                 </div>
//             ) : !hasMore && (
//                 <div className="text-center py-16 text-gray-500 font-semibold">
//                     You have reached the end.
//                 </div>
//             )}
//         </div>
//     );
// };
