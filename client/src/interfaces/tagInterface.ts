export interface SelectedTags {
    tag: string;
    tag_id: number;
}

export interface FilterState {
    selectedTags: SelectedTags[];
    searchQuery: string;
}

export interface FilterDropdownProps {
    onSearch: (query: string, TagIds: number[]) => void;
}

export interface Tag {
    tag_id: number;
    tag: string;
}