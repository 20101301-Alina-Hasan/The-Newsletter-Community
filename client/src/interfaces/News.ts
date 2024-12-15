export interface NewsProps {
    isOpen?: boolean;
    onClose?: () => void;
    news: {
        news_id: number;
        user_id?: number;
        title: string;
        releaseDate: string;
        description: string;
        thumbnail?: string;
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

export interface NewsPageProps {
    fetchNewsFunction: () => Promise<NewsProps['news'][]>;
    emptyMessage: string;
    errorMessage?: string;
}

export interface MyNewsPageProps extends NewsPageProps {
    onDelete?: (news_id: number) => void;
}

export interface UpdateNewsPageProps {
    isOpen: boolean;
    onClose: () => void;
    news_id: number;
    currentTitle: string;
    currentDescription: string;
    currentThumbnail?: string;
    currentTags: string[];
}

