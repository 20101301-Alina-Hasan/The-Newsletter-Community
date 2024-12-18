// import { useState, useEffect } from 'react';
// import { Tag, FilterState, FilterDropdownProps } from '../interfaces/tagInterface';
// import { fetchTags } from '../services/tagService';
// import { FilterIcon } from './Icons/FilterIcon';

// export function FilterDropdown({ onSearch }: FilterDropdownProps) {
//     const [filterState, setFilterState] = useState<FilterState>({
//         selectedTags: [],
//         searchQuery: '',
//     });

//     const [tags, setTags] = useState<Tag[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

//     const generateTags = async () => {
//         try {
//             setLoading(true);
//             const response = await fetchTags();
//             console.log("response", response);
//             const tags = response.map((tag: { tag_id: number; tag: string }) => ({
//                 tag_id: tag.tag_id,
//                 tag: tag.tag
//             }))

//             console.log(tags);
//             setTags(tags);
//         } catch (error) {
//             console.error('Error fetching tags:', error);
//         } finally {
//             setLoading(false);
//         }
//     };


//     useEffect(() => {
//         if (isDropdownOpen) {
//             generateTags();
//         }
//     }, [isDropdownOpen]);

//     const toggleTag = (tag: string) => {
//         setFilterState(prev => ({
//             ...prev,
//             selectedTags: prev.selectedTags.includes(tag)
//                 ? prev.selectedTags.filter(t => t !== tag)
//                 : [...prev.selectedTags, tag]
//         }));
//     };

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const query = event.target.value;
//         setFilterState(prev => ({ ...prev, searchQuery: query }));
//     };

//     const handleSearchSubmit = () => {
//         onSearch(filterState.searchQuery, filterState.selectedTags);
//     };

//     return (
//         <div className="flex items-center gap-2">
//             <div className="relative flex items-center w-full">
//                 <input
//                     type="text"
//                     placeholder="Search"
//                     value={filterState.searchQuery}
//                     onChange={handleSearchChange}
//                     className="input input-bordered h-12 w-full border-1 border-gray-500 rounded-full pl-4 pr-12"
//                 />
//                 <div className="dropdown dropdown-bottom dropdown-right absolute right-3">
//                     <div
//                         tabIndex={0}
//                         role="button"
//                         className="cursor-pointer"
//                         onClick={() => setIsDropdownOpen(prev => !prev)}
//                     >
//                         <FilterIcon />
//                     </div>
//                     <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] mt-4 sm:w-[100px] md:w-300px lg:w-[500px] p-4 shadow">
//                         <div className="divider">Tags</div>
//                         <div className="p-2">
//                             {loading ? (
//                                 <div className="font-serif">Loading...</div>
//                             ) : (
//                                 <div className="flex flex-wrap gap-2">
//                                     {tags.map(tag => (
//                                         <button
//                                             key={tag.tag_id}
//                                             onClick={() => toggleTag(tag.tag)}
//                                             className={`px-3 py-1 rounded-lg text-sm transition-colors ${filterState.selectedTags.includes(tag.tag)
//                                                 ? 'bg-primary text-primary-content'
//                                                 : 'bg-base-200 hover:bg-base-300 text-base-content'
//                                                 }`}
//                                         >
//                                             {tag.tag}
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </ul>
//                 </div>
//             </div>

//             <button
//                 onClick={handleSearchSubmit}
//                 className="btn btn-primary h-12"
//             >
//                 Search
//             </button>
//         </div>
//     );
// }

import { useState, useEffect, useMemo } from 'react';
import { Tag, FilterState, FilterDropdownProps } from '../interfaces/tagInterface';
import { fetchTags } from '../services/tagService';
import { FilterIcon } from './Icons/FilterIcon';
import { Search } from 'lucide-react';


export function FilterDropdown({ onSearch }: FilterDropdownProps) {
    const [filterState, setFilterState] = useState<FilterState>({
        selectedTags: [],
        searchQuery: '',
    });

    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [tagSearchQuery, setTagSearchQuery] = useState('');
    const showAllTags = false;

    const generateTags = async () => {
        try {
            setLoading(true);
            const response = await fetchTags();
            const tags = response.map((tag: { tag_id: number; tag: string }) => ({
                tag_id: tag.tag_id,
                tag: tag.tag,
            }));
            setTags(tags);
        } catch (error) {
            console.error('Error fetching tags:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isDropdownOpen) {
            generateTags();
        }
    }, [isDropdownOpen]);

    const filteredTags = useMemo(() => {
        return tags
            .filter(tag => tag.tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
            .sort((a, b) => a.tag.localeCompare(b.tag));
    }, [tags, tagSearchQuery]);

    const visibleTags = showAllTags ? filteredTags : filteredTags.slice(0, 18);

    const toggleTag = (tag: { tag_id: number; tag: string }) => {
        setFilterState(prev => {
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
        setFilterState(prev => ({ ...prev, searchQuery: query }));
    };

    const handleSearchSubmit = () => {
        const TagIds = filterState.selectedTags.map(tag => tag.tag_id);
        onSearch(filterState.searchQuery, TagIds);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex items-center w-full mr-4">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />

                <input
                    type="text"
                    placeholder="Search"
                    value={filterState.searchQuery}
                    onChange={handleSearchChange}
                    className="input input-bordered h-12 w-full border-1 border-gray-500 rounded-full pl-10 pr-12"
                />

                <div className="dropdown dropdown-right dropdown-bottom absolute right-3">
                    <div
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer"
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                    >
                        <FilterIcon />
                    </div>

                    <div className="dropdown-content menu bg-base-100 rounded-box z-[1] mt-4 sm:w-[100px] md:w-300px lg:w-[500px] p-6 shadow">

                        <div className="relative ml-2">
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                <input
                                    placeholder="Search tags..."
                                    value={tagSearchQuery}
                                    onChange={(e) => setTagSearchQuery(e.target.value)}
                                    className="input input-bordered border-gray-500 border-1 w-sm pl-8 h-8 bg-base-200/50 rounded-full text-sm"
                                />
                            </div>
                        </div>

                        {filterState.selectedTags.length > 0 && (
                            <div>
                                <div className="divider">Selected Tags</div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {filterState.selectedTags.map(tag => (
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
                        )}

                        <div className="divider">Tags</div>

                        {loading ? (
                            <div className="px-3 py-1 rounded-lg text-sm text-base-content opacity-60 italic">Loading...</div>
                        ) : (
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
                                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${filterState.selectedTags.some(t => t.tag_id === tag.tag_id)
                                                    ? 'bg-primary text-primary-content'
                                                    : 'bg-base-200 hover:bg-base-300 text-base-content'
                                                    }`}
                                            >
                                                {tag.tag}
                                            </button>
                                        ))}

                                        {!showAllTags && filteredTags.length > 18 && (
                                            <span className="px-3 py-1 rounded-lg text-sm text-base-content opacity-60 italic">
                                                more...
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={handleSearchSubmit}
                className="btn btn-sm btn-primary h-12"
            >
                Search
            </button>
        </div>
    );
}







