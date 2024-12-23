import { useState, useEffect, useMemo } from 'react';
import {
    Tag,
    FilterState,
    FilterDropdownProps,
    DropdownProps,
    TagListProps,
    TagSearchInputProps,
    SelectedTagsProps
} from '../interfaces/tagInterface';
import { fetchTags } from '../services/tagService';
import { SlidersHorizontal, Search } from 'lucide-react';

export function SearchBar({ onSearch, searchQuery, selectedTags }: FilterDropdownProps) {
    const [filterState, setFilterState] = useState<FilterState>({
        selectedTags: selectedTags || [],
        searchQuery: searchQuery || '',
    });
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tagSearchQuery, setTagSearchQuery] = useState('');
    const showAllTags = false;

    const generateTags = async () => {
        try {
            setLoading(true);
            const response = await fetchTags();
            setTags(response.map((tag: Tag) => ({
                tag_id: tag.tag_id,
                tag: tag.tag,
            })));
        } catch (error) {
            console.error('Error fetching tags:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTags = useMemo(() => {
        return tags
            .filter(tag => tag.tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
            .sort((a, b) => a.tag.localeCompare(b.tag));
    }, [tags, tagSearchQuery]);

    const visibleTags = showAllTags ? filteredTags : filteredTags.slice(0, 16);

    const toggleTag = (tag: Tag) => {
        setFilterState((prev: FilterState) => {
            const exists = prev.selectedTags.some(t => t.tag_id === tag.tag_id);
            return {
                ...prev,
                selectedTags: exists
                    ? prev.selectedTags.filter(t => t.tag_id !== tag.tag_id)
                    : [...prev.selectedTags, tag],
            };
        });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        console.log('Search query changed to:', query);
        setFilterState(prev => ({ ...prev, searchQuery: query }));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearchSubmit();
        }
    };

    const handleSearchSubmit = () => {
        onSearch(filterState.searchQuery, filterState.selectedTags);
    };

    useEffect(() => {
        if (isDropdownOpen) {
            generateTags();
        }
    }, [isDropdownOpen]);

    useEffect(() => {
        setFilterState(prevState => ({
            ...prevState,
            searchQuery: searchQuery,
        }));
    }, [searchQuery]);


    return (
        <>
            <div className="relative flex items-center w-full mr-4">
                <SearchIcon />
                <SearchInput
                    value={filterState.searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                />
                <Dropdown
                    isOpen={isDropdownOpen}
                    toggleDropdown={() => setIsDropdownOpen(prev => !prev)}
                    tagSearchQuery={tagSearchQuery}
                    setTagSearchQuery={setTagSearchQuery}
                    selectedTags={filterState.selectedTags}
                    toggleTag={toggleTag}
                    loading={loading}
                    visibleTags={visibleTags}
                    showAllTags={showAllTags}
                    filteredTags={filteredTags}
                />
            </div>
            <button onClick={handleSearchSubmit} className="btn btn-sm btn-primary h-12 rounded-lg">
                Search
            </button>
        </>
    );
}

const SearchIcon = () => (
    <Search className="text-gray-500 absolute left-3 top-1/2 size-[1.25rem] -translate-y-1/2 text-muted-foreground pointer-events-none" />
);

const SearchInput = ({ value, onChange, onKeyDown }: { value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void }) => (
    <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="input input-bordered h-12 w-full border-1 border-gray-500 rounded-full pl-10 pr-12"
    />
);

const Dropdown = ({
    toggleDropdown,
    tagSearchQuery,
    setTagSearchQuery,
    selectedTags,
    toggleTag,
    loading,
    visibleTags,
    showAllTags,
    filteredTags
}: DropdownProps) => (
    <div className="dropdown dropdown-right dropdown-bottom absolute right-4">
        <div
            tabIndex={0}
            role="button"
            className="cursor-pointer"
            onClick={toggleDropdown}
        >
            <div className="text-gray-400">
                <SlidersHorizontal />
            </div>
        </div>

        <div className="dropdown-content menu bg-base-100 rounded-box z-[1] mt-4 sm:w-[100px] md:w-300px lg:w-[500px] p-6 shadow">
            <TagSearchInput
                tagSearchQuery={tagSearchQuery}
                setTagSearchQuery={setTagSearchQuery}
            />
            <SelectedTags selectedTags={selectedTags} toggleTag={toggleTag} />
            <div className="divider">Tags</div>
            {loading ? (
                <TagLoader />
            ) : (
                <TagList
                    visibleTags={visibleTags}
                    toggleTag={toggleTag}
                    selectedTags={selectedTags}
                    showAllTags={showAllTags}
                    filteredTags={filteredTags}
                />
            )}
        </div>
    </div>
);

const TagSearchInput = ({ tagSearchQuery, setTagSearchQuery }: TagSearchInputProps) => (
    <div className="relative ml-2">
        <div className="relative flex items-center">
            <Search className="text-gray-500 absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
                placeholder="Search tags..."
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                className="input input-bordered border-gray-500 border-1 w-sm pl-8 h-8 bg-base-200/50 rounded-full text-sm"
            />
        </div>
    </div>
);

const SelectedTags = ({ selectedTags, toggleTag }: SelectedTagsProps) => (
    selectedTags.length > 0 && (
        <div>
            <div className="divider">Selected Tags</div>
            <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map(tag => (
                    <button
                        key={tag.tag_id}
                        onClick={() => toggleTag(tag)}
                        className="px-3 py-1 rounded-lg text-sm bg-primary text-primary-content"
                    >
                        {tag.tag}
                    </button>
                ))}
            </div>
        </div>
    )
);

const TagLoader = () => (
    <div className="px-3 py-1 rounded-lg text-sm text-base-content opacity-60 italic">
        Loading...
    </div>
);

const TagList = ({ visibleTags, toggleTag, selectedTags, showAllTags, filteredTags }: TagListProps) => (
    <div>
        {visibleTags.length === 0 ? (
            <div className="px-3 py-1 rounded-lg text-sm text-base-content opacity-60 italic">
                No matching tags available
            </div>
        ) : (
            <div className="flex flex-wrap gap-2">
                {visibleTags.map(tag => (
                    <button
                        key={tag.tag_id}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${selectedTags.some(t => t.tag_id === tag.tag_id)
                            ? 'bg-primary text-primary-content'
                            : 'bg-base-200 hover:bg-base-300 text-base-content'
                            }`}
                    >
                        {tag.tag}
                    </button>
                ))}
                {!showAllTags && filteredTags.length > 16 && (
                    <span className="px-3 py-1 rounded-lg text-sm text-base-content opacity-60 italic">
                        more...
                    </span>
                )}
            </div>
        )}
    </div>
);

