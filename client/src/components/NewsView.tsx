import { Comment } from "./Comment";
import { NewsProps } from "../interfaces/newsInterface";
import { DetailCountBar } from "./DetailCountBar";

export function NewsView({ isOpen, onClose, news }: NewsProps) {

    return (
        <>
            {isOpen && (<div className="modal modal-open">
                <div className="modal-box max-w-4xl">
                    <div className="flex justify-end pb-2">
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            X
                        </button>
                    </div>

                    <div className="pt-2 pb-4 px-6">
                        <div className="w-full h-[1rem] bg-red-800"></div>

                        <div className="items-center my-4">
                            <h2 className="text-5xl font-bold">THE NEWSLETTER</h2>
                            <div className="w-full h-[0.2rem] bg-red-800 mt-2"></div>
                            <h2 className="text-3xl font-semibold my-4">{news.title}</h2>
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
                                <p className="text-base text-justify leading-relaxed">{news.description}</p>
                            </div>
                        </div>
                        <DetailCountBar />
                        <div className="w-full h-[0.1rem] bg-red-800"></div>
                        <div>
                            <Comment news_id={news.news_id} />
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );

}

