import { Tag } from './tagInterface';

export interface NewsProps {
    isOpen?: boolean;
    news: {
        news_id: number;
        user_id?: number;
        title: string;
        releaseDate: string;
        description: string;
        thumbnail?: string;
        upvotes: number;
        commentCount: number;
        tag_ids: number[];
        username: string;
        hasUpvoted: boolean;
        hasBookmarked: boolean;
        createdAt?: string;
        updatedAt?: string;
    };
}

export interface CreateNewsProps {
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

export interface EditNewsPageProps {
    isOpen: boolean;
    onClose: () => void;
    news_id: number;
    currentTitle: string;
    currentDescription: string;
    currentThumbnail?: string;
    currentTags: string[];
}

export interface PromptDeleteProps {
    onDelete: () => void;
    onCancel: () => void;
}


export interface NewsDisplayProps {
    newsList: NewsProps['news'][];
    noResults: boolean;
    hasSearched: boolean;
    loading: boolean;
    hasMore: boolean;
    onConfirmDelete: (news_id: number) => void;
    onNavigate: () => void;
    handleBack: () => void;
    onSearch: (query: string, tags: Tag[]) => void;
    selectedTags: Tag[];
    searchQuery: string;
}


