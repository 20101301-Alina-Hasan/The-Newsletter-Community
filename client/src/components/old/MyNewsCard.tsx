// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { NewsProps } from "../interfaces/newsInterface";
// import { showToast } from "../utils/toast";
// import { Upvote } from "./Upvote";
// import { Bookmark } from "./Bookmark";
// import { MessageSquareText, MoreVertical, Edit, Trash } from 'lucide-react';

// export function MyNewsCard({
//     news_id,
//     title,
//     releaseDate,
//     description,
//     thumbnail,
//     upvotes,
//     commentCount,
//     tags,
//     username,
//     hasBookmarked,
//     hasUpvoted,
//     onDelete
// }: NewsProps["news"] & { onDelete?: (news_id: number) => void }) {
//     const [isDeleting, setIsDeleting] = useState(false);
//     const navigate = useNavigate();

//     const preventClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//     };

//     const handleDelete = async () => {
//         try {
//             if (!onDelete) return;
//             setIsDeleting(true);
//             await onDelete(news_id);
//         } catch (error: any) {
//             showToast("error", `${error.message}: An error occurred while deleting the news.`);
//         } finally {
//             setIsDeleting(false);
//         }
//     };

//     const handleCardClick = () => {
//         navigate("/news-view", {
//             state: {
//                 news: {
//                     news_id
//                 }
//             }
//         });
//     };

//     return (
//         <>
//             <div
//                 onClick={handleCardClick}
//                 className="card bg-base-200 border-[1px] border-gray-500 hover:border-primary hover:border-[2px] hover:bg-base-100 transition-color cursor-pointer"
//             >
//                 <figure className="relative">
//                     <img
//                         src={thumbnail ? thumbnail : "uploads/default-image.png"}
//                         alt={title}
//                         className="w-full h-64 object-cover object-center"
//                     />
//                 </figure>
//                 <div className="absolute top-2 right-2 dropdown">
//                     <div
//                         tabIndex={0}
//                         role="button"
//                         className="btn btn-circle btn-ghost group hover:opacity-100 focus:opacity-100"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <MoreVertical className="w-6 h-6 text-base-content hover:text-primary transition-colors" />
//                     </div>
//                     <ul
//                         tabIndex={0}
//                         className="dropdown-content menu bg-base-100 rounded-box z-[50] w-52 p-2 shadow"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <li>
//                             <button
//                                 className="flex items-center w-full text-left"
//                                 onClick={() =>
//                                     navigate('/edit', {
//                                         state: {
//                                             news_id,
//                                             title,
//                                             releaseDate,
//                                             description,
//                                             thumbnail,
//                                             tags
//                                         },
//                                     })
//                                 }
//                             >
//                                 <Edit className="h-4 w-4 mr-2" /> Edit
//                             </button>
//                         </li>
//                         <li>
//                             <button
//                                 className="flex items-center w-full text-left text-red-600"
//                                 onClick={handleDelete}
//                                 disabled={isDeleting}
//                             >
//                                 <Trash className="h-4 w-4 mr-2" /> {isDeleting ? 'Deleting...' : 'Delete'}
//                             </button>
//                         </li>
//                     </ul>
//                 </div>
//                 <div className="card-body p-4">
//                     <div className="flex items-start justify-between gap-2">
//                         <div className="space-y-2">
//                             <h2 className="card-title font-serif">{title}</h2>
//                             <div className="flex items-center gap-2 text-sm py-2">
//                                 <span>{releaseDate}</span>
//                                 <span className="ml-1 w-[0.1rem] h-[1.2rem] bg-amber-400" />
//                                 <span className="font-semibold">@{username}</span>
//                             </div>
//                             <div className="flex gap-2 flex-wrap mt-2">
//                                 {tags.slice(0, 3).map((tag, index) => ( //line 56
//                                     <div
//                                         key={index}
//                                         className="badge badge-outline badge-md font-semibold"
//                                     >
//                                         #{tag.tag}
//                                     </div>
//                                 ))}
//                                 {tags.length > 3 && (
//                                     <div className="badge badge-outline badge-md font-semibold">
//                                         +{tags.length - 3}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     <div>
//                         <div className="clear-left mt-4">
//                             <div className="w-full h-[0.1rem] bg-red-800" />
//                             <div className="flex justify-between my-4">
//                                 <div className="flex justify-start gap-4" onClick={preventClick}>
//                                     <Upvote news_id={news_id} upvotes={upvotes} hasUpvoted={hasUpvoted} />
//                                     <div className="flex items-center gap-2">
//                                         <MessageSquareText />
//                                         <span className="text-sm font-medium">{commentCount}</span>
//                                     </div>
//                                 </div>
//                                 <div className="justify-end" onClick={preventClick}>
//                                     <Bookmark news_id={news_id} hasBookmarked={hasBookmarked} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }


