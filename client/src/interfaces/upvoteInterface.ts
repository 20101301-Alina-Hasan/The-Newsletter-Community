export type UpvoteState = {
    [news_id: number]: { count: number; hasUpvoted: boolean };
};

export interface UpvoteContextType {
    upvotesState: UpvoteState;
    updateUpvote: (news_id: number, count: number, hasUpvoted: boolean) => void;
}


