import { Upvote } from "./Upvote";
import { Comment } from "./Comment";
import { Bookmark } from "./Bookmark";

interface News {
    isOpen: boolean;
    onClose: () => void;
    news: {
        title: string;
        releaseDate: string;
        description: string;
        thumbnail: string;
        upvotes: number;
        comments: number;
        tags: string[];
        username: string;
    };
}

export function News({ isOpen, onClose, news }: News) {
    return (
        <>
            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-6xl ">
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                className="btn btn-sm btn-circle"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="pt-6 pb-8 pl-20 pr-8">
                            <div className="w-full h-[1.8rem] bg-red-800"></div>

                            <div className="items-center my-6">
                                <h2 className="text-8xl font-bold"> THE NEWSLETTER </h2>
                                <div className="w-full h-[0.2rem] bg-red-800 mt-2"></div>
                                <h2 className="text-6xl font-semibold my-8">{news.title}</h2>
                            </div>


                            <div className="text-md my-6">
                                <span className="p-1 px-4 bg-amber-300 text-gray-900">{news.releaseDate}</span>
                                <span className="p-1 pl-4 bg-amber-400 text-gray-950 font-semibold pr-48 rounded-r-lg">
                                    @{news.username}
                                </span>
                            </div>

                            <div className="flex my-6 gap-2">
                                {news.tags.map((tag, index) => (
                                    <div key={index} className={`badge badge-outline badge-lg ${index === 0 ? 'badge-accent font-bold' : 'font-semibold '}`}>
                                        #{tag}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-base-200 rounded-lg px-6 py-6 pb-8">
                                <img
                                    src={news.thumbnail}
                                    alt={news.title}
                                    className="w-96 h-full rounded-lg object-cover wrap float-left mr-12 mb-6"
                                />

                                <div className="flex-1">
                                    <p className="text-lg text-justify leading-loose">{news.description}</p>
                                </div>
                            </div>


                            <div className="clear-left">
                                <div className="w-full h-[0.1rem] bg-red-800"></div>
                                <div className="flex justify-between m-6">
                                    <div className="flex justify-start gap-4">
                                        <Upvote count={news.upvotes} />
                                        <Comment count={news.comments} />
                                    </div>
                                    <div className="justify-end">
                                        <Bookmark />
                                    </div>
                                </div>
                                <div className="w-full h-[0.1rem] bg-red-800"></div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

