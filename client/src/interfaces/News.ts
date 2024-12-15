export interface NewsProps {
    isOpen?: boolean;
    onClose?: () => void;
    news: {
        news_id?: number;
        user_id?: number;
        title: string;
        releaseDate: string;
        description: string;
        thumbnail: string;
        upvotes: number;
        commentCount: number;
        tags: string[];
        username: string;
        createdAt?: string;
        updatedAt?: string;
    };
}

export interface CreateNewsProps {
    isOpen: boolean;
    onClose: () => void;
}