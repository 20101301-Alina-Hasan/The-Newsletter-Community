export interface UserInteraction {
    upvotedNewsIds: number[];
    bookmarkedNewsIds: number[];
}

export interface UserCount {
    upvotes: number;
    commentCount: number;
}