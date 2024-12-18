/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { fetchComments, addComment, editComment, deleteComment } from "../services/commentService";
import { CommentsProps } from "../interfaces/commentInterface";
import { UserContext, UserContextType } from '../interfaces/userInterfaces';
import { LoaderIcon } from "./Icons/LoaderIcon";
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { showToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";

export function Comment({ news_id }: CommentsProps) {
    const { userState } = useContext(UserContext) as UserContextType;
    const [comments, setComments] = useState<CommentsProps["news"][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editedComment, setEditedComment] = useState<string>("");
    const [newComment, setNewComment] = useState<string>("");
    const [commentCount, setCommentCount] = useState<number>(0);
    const navigate = useNavigate();
    const token = userState.token

    useEffect(() => {
        const loadComments = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedComments = await fetchComments(news_id);
                setComments(fetchedComments);
                setCommentCount(fetchedComments.length);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [news_id]);

    const handleEditComment = (comment_id: number, comment: string) => {
        setEditingCommentId(comment_id);
        setEditedComment(comment);
    };

    const handleEditChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedComment(event.target.value);
    };

    const handleUpdateComment = async (comment_id: number) => {
        try {
            if (!editedComment) return;
            await editComment(comment_id, editedComment);
            const updatedComments = comments.map((comment) =>
                comment?.comment_id === comment_id
                    ? { ...comment, comment: editedComment }
                    : comment
            );
            setComments(updatedComments);
            setEditingCommentId(null);
            showToast('success', 'Your comment has been updated successfully');
        } catch (error: any) {
            showToast('error', `${error.message}: Failed to update the comment.`);
        }
    };

    const handleDeleteComment = async (comment_id: number) => {
        try {
            await deleteComment(comment_id);
            const updatedComments = await fetchComments(news_id);
            setComments(updatedComments);
            setCommentCount(updatedComments.length);
            showToast('success', 'Your comment has been removed.');
        } catch (error: any) {
            showToast('error', `${error.message}: Failed to remove your comment.`);
        }
    };

    const handleAddComment = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            if (!token) {
                navigate("/signup");
                return;
            }
            if (!newComment.trim()) return;
            console.log(news_id, newComment);
            await addComment(news_id, newComment);
            const comments = await fetchComments(news_id);
            setComments([...comments]);
            setCommentCount(comments.length);
            setNewComment('');
            showToast('success', 'Your comment was posted.');
        } catch (error: any) {
            showToast('error', `${error.message}: Failed to add your comment.`);
        }
    };

    if (loading) {
        return <LoaderIcon />
    }

    if (error) {
        return <div className="min-h-screen bg-base-200 text-red-500 font-semibold">Error: {error}</div>;
    }

    return (
        <section className="bg-base-100 py-8 antialiased">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg lg:text-2xl font-bold text-base-content">
                        Discussion ({commentCount})
                    </h2>
                </div>

                <form className="mb-6" onSubmit={handleAddComment}>
                    <div className="py-2 px-4 mb-4 bg-base-200 rounded-lg border border-base-300">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea
                            id="comment"
                            rows={6}
                            className="px-0 w-full text-sm bg-base-200 border-0 focus:ring-0 focus:outline-none text-base-content placeholder:text-base-content/50"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Post
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
                            comments.map((comment: any) => (
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
                                        {comment.username === userState.user?.username ? (
                                            <div className="dropdown dropdown-end">
                                                <label tabIndex={0} className="btn btn-ghost btn-xs">
                                                    <MoreVertical className="h-4 w-4" />
                                                </label>
                                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                    <li>
                                                        <a
                                                            className="text-base-content"
                                                            onClick={() => handleEditComment(comment.comment_id, comment.comment)}
                                                        >
                                                            <Edit className="h-4 w-4" /> Edit
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a className="text-base-content" onClick={() => handleDeleteComment(comment.comment_id)}>
                                                            <Trash className="h-4 w-4" /> Delete
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        ) : null}
                                    </footer>

                                    {editingCommentId === comment.comment_id ? (
                                        <div>
                                            <textarea
                                                value={editedComment}
                                                onChange={handleEditChange}
                                                rows={4}
                                                className="w-full p-4 bg-base-200 border-0 focus:ring-0 focus:outline-secondary text-base-content"
                                            />
                                            <button
                                                onClick={() => handleUpdateComment(comment.comment_id)}
                                                className="btn btn-primary mt-2"
                                            >
                                                Update Comment
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-base-content/80">{comment.comment}</p>
                                    )}
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
