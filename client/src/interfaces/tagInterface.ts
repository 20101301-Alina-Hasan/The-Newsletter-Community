export interface Tag {
    tag_id: number;
    tag: string;
}

export interface FilterState {
    selectedTags: Tag[];
    searchQuery: string;
}

export interface FilterDropdownProps {
    onSearch: (query: string, selectedTags: number[]) => void;
}

export interface DropdownProps {
    isOpen: boolean;
    toggleDropdown: () => void;
    tagSearchQuery: string;
    setTagSearchQuery: (query: string) => void;
    selectedTags: Tag[];
    toggleTag: (tag: Tag) => void;
    loading: boolean;
    visibleTags: Tag[];
    showAllTags: boolean;
}

export interface TagListProps {
    visibleTags: Tag[];
    toggleTag: (tag: Tag) => void;
    selectedTags: Tag[];
    showAllTags: boolean;
}

export interface TagSearchInputProps {
    tagSearchQuery: string;
    setTagSearchQuery: (query: string) => void
}

export interface SelectedTagsProps {
    selectedTags: Tag[];
    toggleTag: (tag: Tag) => void
}