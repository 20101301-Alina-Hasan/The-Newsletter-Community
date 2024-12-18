import { useState, useEffect, useContext } from "react";
import { addUpvote, removeUpvote } from "../services/upvoteService";
import { UserContext, UserContextType } from "../interfaces/userInterfaces";
import { UpvoteProps } from "../interfaces/upvoteInterface";
import { useNavigate } from "react-router-dom";
import { CircleArrowUp } from "lucide-react";

export function Upvote({ news_id, hasUpvoted, upvotes }: UpvoteProps) {
    const { userState } = useContext(UserContext) as UserContextType;
    const [isUpvoted, setIsUpvoted] = useState(hasUpvoted);
    const [count, setCount] = useState(upvotes);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const token = userState.token;

    const handleUpvote = async () => {
        if (!token) {
            navigate('/signup');
            return;
        }

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
                className={`btn btn-circle btn-xs ${isUpvoted ? 'btn-accent' : 'btn-ghost'}`}
                onClick={handleUpvote}
                disabled={isLoading}
            >
                < CircleArrowUp />
            </button>
            <span>{count}</span>
        </div>
    );
}




