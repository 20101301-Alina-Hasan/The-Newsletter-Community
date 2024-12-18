import { useNavigate } from "react-router-dom";
import { MessageSquareText } from "lucide-react";
import { NewsProps } from "../interfaces/newsInterface";
import { Bookmark } from "./Bookmark";
import { Upvote } from "./Upvote";

export function NewsCard({
    news_id,
    title,
    releaseDate,
    thumbnail,
    upvotes,
    commentCount,
    tags,
    username,
    hasUpvoted,
    hasBookmarked
}: NewsProps['news']) {
    const navigate = useNavigate();

    const preventClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleCardClick = () => {
        navigate("/news-view", {
            state: {
                news: {
                    news_id,
                }
            }
        });
    };

    return (
        <div
            onClick={handleCardClick}
            className="card bg-base-200 border-[1px] border-gray-500 hover:border-primary hover:border-[2px] hover:bg-base-100 transition-color cursor-pointer"
        >
            <figure className="relative">
                <img
                    src={thumbnail ? thumbnail : "uploads/default-image.png"}
                    alt={title}
                    className="w-full h-64 object-cover object-center"
                />
            </figure>
            <div className="card-body p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-2">
                        <h2 className="card-title font-serif">{title}</h2>
                        <div className="flex items-center gap-2 text-sm py-2">
                            <span>{releaseDate}</span>
                            <span className="ml-1 w-[0.1rem] h-[1.2rem] bg-amber-400" />
                            <span className="font-semibold">@{username}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap mt-2">
                            {tags.slice(0, 3).map((tag, index) => ( //line 56
                                <div
                                    key={index}
                                    className="badge badge-outline badge-md font-semibold"
                                >
                                    #{tag.tag}
                                </div>
                            ))}
                            {tags.length > 3 && (
                                <div className="badge badge-outline badge-md font-semibold">
                                    +{tags.length - 3}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="clear-left mt-4">
                        <div className="w-full h-[0.1rem] bg-red-800" />
                        <div className="flex justify-between my-4">
                            <div className="flex justify-start gap-4" onClick={preventClick}>
                                <Upvote news_id={news_id} upvotes={upvotes} hasUpvoted={hasUpvoted} />
                                <div className="flex items-center gap-2">
                                    <MessageSquareText />
                                    <span className="text-sm font-medium">{commentCount}</span>
                                </div>
                            </div>
                            <div className="justify-end" onClick={preventClick}>
                                <Bookmark news_id={news_id} hasBookmarked={hasBookmarked} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
