/* eslint-disable @typescript-eslint/no-unused-vars */
import { addBookmark, removeBookmark } from '../services/bookmarkService';
import { UnmarkedIcon, BookmarkedIcon } from "./Icons/BookmarkIcon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from '../utils/toast';
import { useUserContext } from "../contexts/userContext";

export function Bookmark({ news_id, hasBookmarked }: { news_id: number, hasBookmarked: boolean }) {
    const [isBookmarked, setIsBookmarked] = useState(hasBookmarked);
    const [isLoading, setIsLoading] = useState(false);
    const { userState } = useUserContext();
    const navigate = useNavigate();
    const token = userState.token;

    const handleBookmark = async () => {
        if (!token) {
            navigate("/signup");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        const newBookmarkState = !isBookmarked;
        setIsBookmarked(newBookmarkState);

        try {
            if (newBookmarkState) {
                await addBookmark(news_id, token);
                showToast('success', 'Bookmark Added.');
            } else {
                await removeBookmark(news_id, token);
                showToast('success', 'Bookmark Removed.');
            }
        } catch (error) {
            console.error("Failed to update bookmark status:", error);
            setIsBookmarked(!newBookmarkState);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsBookmarked(hasBookmarked);
    }, [hasBookmarked]);

    return (
        <button
            onClick={handleBookmark}
            disabled={isLoading}
            className="hover:text-red-800 transition-colors"
        >
            {!isBookmarked ? (
                < UnmarkedIcon />
            ) : (
                < BookmarkedIcon />
            )}
        </button>
    );
}
