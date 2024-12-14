export interface NewsProps {
    isOpen?: boolean;
    onClose?: () => void;
    news: {
        title: string;
        releaseDate: string;
        description: string;
        thumbnail: string;
        upvotes: number;
        comments: number;
        tags: string[];
        username: string;
    };
}