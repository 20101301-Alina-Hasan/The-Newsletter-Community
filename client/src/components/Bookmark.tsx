/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { addBookmark, removeBookmark } from '../services/bookmarkService';
import { UserContext, UserContextType } from "../interfaces/userInterfaces";
import { useNavigate } from "react-router-dom";
import { showToast } from '../utils/toast';
import { useContext } from 'react';

export function Bookmark({ news_id, hasBookmarked }: { news_id: number, hasBookmarked: boolean }) {
    const { userState } = useContext(UserContext) as UserContextType;
    const [isBookmarked, setIsBookmarked] = useState(hasBookmarked);
    const [isLoading, setIsLoading] = useState(false);
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
                await addBookmark(news_id);
                showToast('success', 'Bookmark Added.');
            } else {
                await removeBookmark(news_id);
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
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z"></path>
                </svg>
            ) : (
                <svg className="w-5 h-5 text-red-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                    <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z"></path>
                </svg>
            )}
        </button>
    );
}
