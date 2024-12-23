export interface UserInteraction {
    upvotedNewsIds: number[];
    bookmarkedNewsIds: number[];
}

export interface UserCount {
    upvotes: number;
    commentCount: number;
}

export interface User {
    user_id: number;
    username: string;
};
