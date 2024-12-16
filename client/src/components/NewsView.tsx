/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// // 
// import { Comment } from "./Comment";
// import { useLocation } from "react-router-dom";
// import { Upvote } from "./Upvote";
// import { Bookmark } from "./Bookmark";
// import { useNavigate } from "react-router-dom";


// export function NewsView() {
//     const navigate = useNavigate();
//     const { state } = useLocation();
//     const { news } = state || {};

//     return (
//         <>
//             <div className="modal modal-open">
//                 <div className="modal-box max-w-4xl">
//                     <div className="flex justify-end pb-2">
//                         <button
//                             onClick={() => navigate(-1)}
//                             aria-label="Close"
//                             className="btn btn-sm btn-circle btn-ghost"
//                         >
//                             X
//                         </button>
//                     </div>

//                     <div className="pt-2 pb-4 px-6">
//                         <div className="w-full h-[1rem] bg-red-800"></div>

//                         <div className="items-center my-4">
//                             <h2 className="text-5xl font-extrabold font-serif">THE NEWSLETTER</h2>
//                             <div className="w-full h-[0.2rem] bg-red-800 mt-2"></div>
//                             <h2 className="text-3xl font-semibold my-4 font-serif">{news.title}</h2>
//                         </div>

//                         <div className="text-sm my-4">
//                             <span className="p-1 px-3 bg-amber-300 text-gray-900">{news.releaseDate}</span>
//                             <span className="p-1 pl-3 bg-amber-400 text-gray-950 font-semibold pr-24 rounded-r-lg">
//                                 @{news.username}
//                             </span>
//                         </div>

//                         <div className="flex my-4 gap-2 flex-wrap">
//                             {news.tags.map((tag: string, index: number) => (
//                                 <div key={index} className='badge badge-outline font-medium'>
//                                     #{tag}
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="bg-base-200 rounded-lg p-4 overflow-hidden">
//                             {news.thumbnail && (
//                                 <img
//                                     src={news.thumbnail}
//                                     alt={news.title}
//                                     className="w-72 rounded-lg object-cover float-left mr-6 mb-4"
//                                 />
//                             )}
//                             <div className="flex-1 min-w-[50%]">
//                                 <p className="text-base text-justify leading-relaxed font-serif">{news.description}</p>
//                             </div>
//                         </div>
//                         <div className="clear-left mt-4">
//                             <div className="w-full h-[0.1rem] bg-red-800" />
//                             <div className="flex justify-between my-4">
//                                 <div className="flex justify-start gap-4">
//                                     <Upvote news_id={news.news_id} upvotes={news.upvotes} hasUpvoted={news.hasUpvoted} />
//                                     <div className="flex items-center gap-2">
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             strokeWidth="1.5"
//                                             stroke="currentColor"
//                                             className="size-6"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
//                                             />
//                                         </svg>
//                                         <span className="text-sm font-medium">{news.commentCount}</span>
//                                     </div>
//                                 </div>
//                                 <div className="justify-end">
//                                     <Bookmark news_id={news.news_id} hasBookmarked={news.hasBookmarked} />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="w-full h-[0.1rem] bg-red-800"></div>
//                         <div>
//                             <Comment news_id={news.news_id} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
// 
import { Comment } from "./Comment";
import { useLocation } from "react-router-dom";
import { Upvote } from "./Upvote";
import { Bookmark } from "./Bookmark";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { fetchNewsById } from "../services/newsService";
import { UserContextType, UserContext } from "../interfaces/userInterfaces";

export function NewsView() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [news, setNews] = useState<any>(null); // Add state to store the fetched news
    const { userState } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const { state } = useLocation();
    const { news_id } = state?.news || {}; // Ensure safe access to `news_id` from location state

    useEffect(() => {
        const loadNews = async () => {
            try {
                if (!news_id) {
                    throw new Error("News ID is missing");
                }

                const user_id = userState.user?.user_id;
                const fetchedNews = await fetchNewsById(news_id, user_id); // Fetch the news by ID
                setNews(fetchedNews); // Update state with the fetched news
            } catch (error: any) {
                console.error("Error loading news:", error);
                setError(error.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [news_id, userState.user?.user_id]);

    if (loading) {
        return <div className="p-4 font-serif">Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!news) {
        return <div>No news found.</div>;
    }

    return (
        <>
            <div className="modal modal-open">
                <div className="modal-box max-w-4xl">
                    <div className="flex justify-end pb-2">
                        <button
                            onClick={() => navigate(-1)}
                            aria-label="Close"
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            X
                        </button>
                    </div>

                    <div className="pt-2 pb-4 px-6">
                        <div className="w-full h-[1rem] bg-red-800"></div>

                        <div className="items-center my-4">
                            <h2 className="text-5xl font-extrabold font-serif">THE NEWSLETTER</h2>
                            <div className="w-full h-[0.2rem] bg-red-800 mt-2"></div>
                            <h2 className="text-3xl font-semibold my-4 font-serif">{news.title}</h2>
                        </div>

                        <div className="text-sm my-4">
                            <span className="p-1 px-3 bg-amber-300 text-gray-900">{news.releaseDate}</span>
                            <span className="p-1 pl-3 bg-amber-400 text-gray-950 font-semibold pr-24 rounded-r-lg">
                                @{news.username}
                            </span>
                        </div>

                        <div className="flex my-4 gap-2 flex-wrap">
                            {news.tags.map((tag: string, index: number) => (
                                <div key={index} className='badge badge-outline font-medium'>
                                    #{tag}
                                </div>
                            ))}
                        </div>

                        <div className="bg-base-200 rounded-lg p-4 overflow-hidden">
                            {news.thumbnail && (
                                <img
                                    src={news.thumbnail}
                                    alt={news.title}
                                    className="w-72 rounded-lg object-cover float-left mr-6 mb-4"
                                />
                            )}
                            <div className="flex-1 min-w-[50%]">
                                <p className="text-base text-justify leading-relaxed font-serif">{news.description}</p>
                            </div>
                        </div>
                        <div className="clear-left mt-4">
                            <div className="w-full h-[0.1rem] bg-red-800" />
                            <div className="flex justify-between my-4">
                                <div className="flex justify-start gap-4">
                                    <Upvote news_id={news.news_id} upvotes={news.upvotes} hasUpvoted={news.hasUpvoted} />
                                    <div className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium">{news.commentCount}</span>
                                    </div>
                                </div>
                                <div className="justify-end">
                                    <Bookmark news_id={news.news_id} hasBookmarked={news.hasBookmarked} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-[0.1rem] bg-red-800"></div>
                        <div>
                            <Comment news_id={news.news_id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


