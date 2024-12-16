import { useState } from "react";
import { DetailCountBar } from "./DetailCountBar";
import { NewsView } from "./NewsView";
import { NewsProps } from "../interfaces/newsInterface";

export function NewsCard({
    news_id,
    title,
    releaseDate,
    description,
    thumbnail,
    upvotes,
    commentCount,
    tags,
    username
}: NewsProps['news']) {
    const [isNewsOpen, setIsNewsOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsNewsOpen(true)}
                className="card bg-base-200 border-[1px] border-gray-500 hover:border-primary hover:border-[2px] hover:bg-base-100 transition-color cursor-pointer"
            >
                <figure className="relative">
                    <img
                        src={thumbnail ? thumbnail : "public/default-image.png"}
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
                                {tags.slice(0, 3).map((tag, index) => (
                                    <div
                                        key={index}
                                        className="badge badge-outline badge-md font-semibold"
                                    >
                                        #{tag}
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
                    <DetailCountBar />
                </div>
            </div>
            <NewsView
                isOpen={isNewsOpen}
                onClose={() => setIsNewsOpen(false)}
                news={{
                    news_id,
                    title,
                    releaseDate,
                    description,
                    thumbnail,
                    upvotes,
                    commentCount,
                    tags,
                    username
                }}
            />
        </>
    );
}
