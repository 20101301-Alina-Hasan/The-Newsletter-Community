/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageSquareText } from "lucide-react";
import { Upvote } from "./Upvote";
import { Bookmark } from "./Bookmark";
import { Comment } from "./Comment";
import { LoaderIcon } from "./Icons/LoaderIcon";
import { fetchNews } from '../services/newsService';
import { NewsProps } from "../interfaces/newsInterface";
import { useUserContext } from "../contexts/userContext";

export function NewsView() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [news, setNews] = useState<NewsProps["news"][]>([]);
    const navigate = useNavigate();
    const { state } = useLocation();
    const { news_id } = state?.news || {};
    const { userState } = useUserContext();
    const token = userState.token;

    const loadNews = async () => {
        try {
            if (!news_id) {
                throw new Error("News ID is missing");
            }
            const fetchedNews = await fetchNews(news_id, token);
            console.log(fetchedNews);
            setNews(fetchedNews);

        } catch (error: any) {
            setError(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
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
                            {news.tags.map((tag, index) => (
                                <div key={index} className='badge badge-outline font-medium'>
                                    #{tag.tag}
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
                                        <MessageSquareText />
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
                </div >
            </div >
        </>
    );
}

// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Upvote } from "./Upvote";
// import { Bookmark } from "./Bookmark";
// import { Comment } from "./Comment";
// import { MessageSquareText } from "lucide-react";
// import { LoaderIcon } from "./Icons/LoaderIcon";
// import { fetchNews } from '../services/newsService';
// import { NewsProps } from "../interfaces/newsInterface";
// import Cookies from "js-cookie";


// export function NewsView() {
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [news, setNews] = useState<NewsProps["news"][]>([]);
//     const navigate = useNavigate();
//     const { state } = useLocation();
//     const { news_id } = state?.news || {};
//     const token = Cookies.get('access_token');

//     useEffect(() => {
//         const loadNews = async () => {
//             try {
//                 if (!news_id) {
//                     throw new Error("News ID is missing");
//                 }
//                 console.log("token sent", token, "news_id sent", news_id)
//                 const fetchedNews = await fetchNews(news_id, token);
//                 console.log(fetchedNews);
//                 setNews(fetchedNews);

//             } catch (error: any) {
//                 setError(error.message || "An unexpected error occurred.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadNews();
//     }, [news_id, token]);

//     if (loading) {
//         return <LoaderIcon />
//     }

//     if (error) {
//         return <div className="min-h-screen bg-base-200 text-red-500 font-semibold">Error: {error}</div>;
//     }

//     if (!news) {
//         return <div>No news found.</div>;
//     }

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
//                             <h2 className="text-3xl font-semibold my-4 font-serif">{news[0].title}</h2>
//                         </div>

//                         <div className="text-sm my-4">
//                             <span className="p-1 px-3 bg-amber-300 text-gray-900">{news[0].releaseDate}</span>
//                             <span className="p-1 pl-3 bg-amber-400 text-gray-950 font-semibold pr-24 rounded-r-lg">
//                                 @{news[0].username}
//                             </span>
//                         </div>

//                         <div className="flex my-4 gap-2 flex-wrap">
//                             {news[0].tags.map((tag, index) => (
//                                 <div key={index} className='badge badge-outline font-medium'>
//                                     #{tag.tag}
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="bg-base-200 rounded-lg p-4 overflow-hidden">
//                             {news[0].thumbnail && (
//                                 <img
//                                     src={news[0].thumbnail}
//                                     alt={news[0].title}
//                                     className="w-72 rounded-lg object-cover float-left mr-6 mb-4"
//                                 />
//                             )}
//                             <div className="flex-1 min-w-[50%]">
//                                 <p className="text-base text-justify leading-relaxed font-serif">{news[0].description}</p>
//                             </div>
//                         </div>
//                         <div className="clear-left mt-4">
//                             <div className="w-full h-[0.1rem] bg-red-800" />
//                             <div className="flex justify-between my-4">
//                                 <div className="flex justify-start gap-4">
//                                     <Upvote news_id={news[0].news_id} upvotes={news[0].upvotes} hasUpvoted={news[0].hasUpvoted} />
//                                     <div className="flex items-center gap-2">
//                                         <MessageSquareText />
//                                         <span className="text-sm font-medium">{news[0].commentCount}</span>
//                                     </div>
//                                 </div>
//                                 <div className="justify-end">
//                                     <Bookmark news_id={news[0].news_id} hasBookmarked={news[0].hasBookmarked} />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="w-full h-[0.1rem] bg-red-800"></div>
//                         <div>
//                             <Comment news_id={news[0].news_id} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }




