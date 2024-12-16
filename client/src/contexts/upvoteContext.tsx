/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UpvoteContextType, UpvoteState } from '../interfaces/upvoteInterface';
import { useMemo } from 'react';

const UpvoteContext = createContext<UpvoteContextType | undefined>(undefined);

export const useUpvote = () => {
    const context = useContext(UpvoteContext);
    if (!context) {
        throw new Error("useUpvote must be used within an UpvoteProvider");
    }
    return context;
};

export const UpvoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [upvotesState, setUpvotesState] = useState<UpvoteState>({});

    const updateUpvote = (news_id: number, count: number, hasUpvoted: boolean) => {
        setUpvotesState((prev) => {
            console.log("Previous state:", prev);
            const newState = {
                ...prev,
                [news_id]: { count, hasUpvoted },
            };
            console.log("Updated state:", newState);
            return newState;
        });
    };

    const contextValue = useMemo(() => ({ upvotesState, updateUpvote }), [upvotesState]);

    return (
        <UpvoteContext.Provider value={contextValue}>
            {children}
        </UpvoteContext.Provider>
    );
};

