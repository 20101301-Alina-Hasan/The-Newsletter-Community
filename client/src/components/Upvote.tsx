import { useState, useEffect } from "react";
import { addUpvote, removeUpvote } from "../services/upvoteService";

export function Upvote({ news_id, hasUpvoted, upvotes }: { news_id: number, hasUpvoted: boolean, upvotes: number }) {
    const [isUpvoted, setIsUpvoted] = useState(hasUpvoted);
    const [count, setCount] = useState(upvotes);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpvote = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const newUpvoteState = !isUpvoted;
        const newCount = newUpvoteState ? count + 1 : count - 1;

        setIsUpvoted(newUpvoteState);
        setCount(newCount);

        try {
            if (newUpvoteState) {
                await addUpvote(news_id);
            } else {
                await removeUpvote(news_id);
            }
        } catch (error) {
            console.error("Failed to update upvote status:", error);
            setIsUpvoted(!newUpvoteState);
            setCount(newUpvoteState ? count - 1 : count + 1);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsUpvoted(hasUpvoted);
    }, [hasUpvoted]);

    return (
        <div className="flex items-center space-x-2">
            <button
                className={`btn btn-circle btn-xs ${isUpvoted ? 'btn-primary' : 'btn-outline'}`}
                onClick={handleUpvote}
                disabled={isLoading}
            >
                <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 14"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13V1m0 0L1 5m4-4 4 4"
                    />
                </svg>
            </button>
            <span>{count}</span>
        </div>
    );
}




