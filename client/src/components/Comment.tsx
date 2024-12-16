/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchComments } from "../services/commentService";
import { CommentsProps } from "../interfaces/commentInterface";

export function Comment({ news_id, count }: CommentsProps) {
    const [comments, setComments] = useState<CommentsProps["news"][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadComments = async () => {
            setLoading(true);
            setError(null);

            try {
                const fetchedComments = await fetchComments(news_id);
                setComments(fetchedComments);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [news_id]);

    return (
        <section className="bg-base-100 py-8 antialiased">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg lg:text-2xl font-bold text-base-content">
                        Discussion ({count})
                    </h2>
                </div>

                <form className="mb-6">
                    <div className="py-2 px-4 mb-4 bg-base-200 rounded-lg border border-base-300">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea
                            id="comment"
                            rows={6}
                            className="px-0 w-full text-sm bg-base-200 border-0 focus:ring-0 focus:outline-none text-base-content placeholder:text-base-content/50"
                            placeholder="Write a comment..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Post comment
                    </button>
                </form>

                {loading ? (
                    <p className="text-center text-base-content/70">Loading comments...</p>
                ) : error ? (
                    <p className="text-error text-center">{error}</p>
                ) : (
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-base-content/70 text-center">No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map((comment) => (
                                <article
                                    key={comment.comment_id}
                                    className="p-6 text-base bg-base-200 rounded-lg"
                                >
                                    <footer className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col space-y-[2px] mb-2">
                                                <p className="text-lg font-bold text-base-content">
                                                    {comment.name}
                                                </p>
                                                <p className="text-xs font-semibold text-base-content">
                                                    @{comment.username}
                                                </p>
                                            </div>
                                        </div>
                                    </footer>
                                    <p className="text-base-content/80">{comment.comment}</p>
                                    <p className="text-sm text-base/70 text-right p-2">
                                        {comment.created_at}
                                    </p>
                                </article>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
