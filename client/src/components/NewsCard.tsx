import { useState } from "react"
import { Upvote } from "./Upvote"
import { Comment } from "./Comment"
import { Bookmark } from "./Bookmark"
import { News } from "./News"

interface NewsCardProps {
    title: string
    releaseDate: string
    description: string
    thumbnail: string
    upvotes: number
    comments: number
    tags: string[]
    username: string
}

export function NewsCard({ title, releaseDate, description, thumbnail, upvotes, comments, tags, username }: NewsCardProps) {
    const [isNewsOpen, setIsNewsOpen] = useState(false)

    return (
        <>
            <div
                onClick={() => setIsNewsOpen(true)}
                className="card bg-base-100 border-[1px] border-gray-500 hover:border-primary transition-colors cursor-pointer"
            >
                <figure>
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-64 object-cover object-center"
                    />
                </figure>

                <div className="card-body p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-2">
                            <h2 className="card-title">{title}</h2>
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
                    <div className="w-full h-[0.1rem] bg-red-800 mt-4 mb-2"></div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Bookmark />
                        </div>
                        <div className="flex items-center gap-4">
                            <Upvote count={upvotes} />
                            <Comment count={comments} />
                        </div>
                    </div>
                </div>
            </div>
            <News
                isOpen={isNewsOpen}
                onClose={() => setIsNewsOpen(false)}
                news={{
                    title,
                    releaseDate,
                    description,
                    thumbnail,
                    upvotes,
                    comments,
                    tags,
                    username
                }}
            />
        </>
    )
}
