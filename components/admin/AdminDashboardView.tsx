// seri-docker/sereinsoulchatbotui-main/components/admin/AdminDashboardView.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserProfile } from '../../types/UserProfile'; // Import UserProfile type

// --- Icons (Keep these as they are) ---
const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);
const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
);
const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);
// ------------------------------------

interface AdminDashboardViewProps {
    profiles: UserProfile[];
    isLoading: boolean;
    onSelectProfile: (profile: UserProfile) => void;
}

type UserFilterType = 'all' | 'named' | 'unnamed';
type GenderFilterType = 'all' | 'male' | 'female' | 'other' | 'unspecified';

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ profiles, isLoading, onSelectProfile }) => {
    // Filter States
    const [searchText, setSearchText] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [userTypeFilter, setUserTypeFilter] = useState<UserFilterType>('all');
    const [minAgeFilter, setMinAgeFilter] = useState<string>('');
    const [maxAgeFilter, setMaxAgeFilter] = useState<string>('');
    const [genderFilter, setGenderFilter] = useState<GenderFilterType>('all');

    const filterDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
            const filterButton = document.getElementById('filter-button');
             if (!filterButton || !filterButton.contains(event.target as Node)) {
                setShowFilters(false);
             }
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

    // Filtering Logic
    const filteredProfiles = useMemo(() => {
        const searchTerm = searchText.toLowerCase().trim();
        const minAgeNum = parseInt(minAgeFilter, 10);
        const maxAgeNum = parseInt(maxAgeFilter, 10);

        return profiles.filter(profile => {
            if (searchTerm) {
                const name = profile.name?.toLowerCase() || '';
                const phone = profile.phoneNumber.toLowerCase();
                if (!name.includes(searchTerm) && !phone.includes(searchTerm)) return false;
            }
            if (userTypeFilter === 'named' && (!profile.name || profile.name.trim() === '')) return false;
            if (userTypeFilter === 'unnamed' && profile.name && profile.name.trim() !== '') return false;
            const profileAge = profile.age;
            if (!isNaN(minAgeNum) && (profileAge === null || profileAge === undefined || profileAge < minAgeNum)) return false;
            if (!isNaN(maxAgeNum) && (profileAge === null || profileAge === undefined || profileAge > maxAgeNum)) return false;
            if (genderFilter !== 'all') {
                const profileGenderLower = (profile.gender && profile.gender.trim() !== '') ? profile.gender.trim().toLowerCase() : 'unspecified';
                if (genderFilter === 'unspecified') {
                    if (profileGenderLower !== 'unspecified') return false;
                } else {
                     if (profileGenderLower === 'unspecified' || profileGenderLower !== genderFilter) return false;
                }
            }
            return true;
        });
    }, [profiles, searchText, userTypeFilter, minAgeFilter, maxAgeFilter, genderFilter]);

    // --- CORRECTED: UserItem component ---
    const UserItem: React.FC<{profile: UserProfile}> = ({ profile }) => {
        // Helper function to get value or 'N/A'
        const getValue = (value: string | number | null | undefined): string | number => {
            // // REMOVED THIS LINE: Ensure boolean false isn't treated as empty
            // if (value === false) return String(value);

            // Ensure number 0 isn't treated as empty
             if (value === 0) return String(value); // Keep this check for age 0

            // Treat null, undefined, or empty/whitespace string as N/A
            return (value === null || value === undefined || String(value).trim() === '') ? 'N/A' : value;
        };

        const displayName = profile.name || profile.phoneNumber;
        const displayPhone = profile.name ? profile.phoneNumber : null; // Only show phone separately if name exists

        return (
            <button
                onClick={() => onSelectProfile(profile)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:bg-blue-50 focus:ring-1 focus:ring-blue-300 transition-colors duration-150 block mb-2 shadow-sm min-h-[6rem] flex flex-col justify-between" // Adjust min-h-[6rem] (or h-[6rem]) as needed
            >
                {/* Top part: Name/Phone */}
                <div>
                    <p className="text-sm font-semibold text-gray-800 truncate mb-0.5">
                        {displayName}
                    </p>
                    {displayPhone && (
                        <p className="text-xs text-gray-600 truncate">{displayPhone}</p>
                    )}
                </div>

                {/* Bottom part: Age/Gender */}
                 <p className="text-xs text-gray-500 truncate mt-1">
                    Age: {getValue(profile.age)} | Gender: {getValue(profile.gender)}
                </p>
            </button>
        );
    };
    // -----------------------------------

    const PlaceholderRow = () => <div className="h-16 bg-gray-200 rounded-lg w-full animate-pulse mb-2"></div>; // Adjusted placeholder

    // Split profiles for three columns
    const columns = 3;
    const itemsPerColumn = Math.ceil(filteredProfiles.length / columns);
    const columnProfiles = Array.from({ length: columns }, (_, colIndex) =>
        filteredProfiles.slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn)
    );

    const resetFilters = () => {
        setUserTypeFilter('all');
        setMinAgeFilter('');
        setMaxAgeFilter('');
        setGenderFilter('all');
        setShowFilters(false);
    };

    const filtersActive = userTypeFilter !== 'all' || minAgeFilter !== '' || maxAgeFilter !== '' || genderFilter !== 'all';

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm flex flex-col h-full">
             <h1 className="text-2xl font-semibold text-gray-800 mb-4 flex-shrink-0">USERS OVERVIEW</h1>

            {/* Header with Search/Filter */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 flex-shrink-0 relative">
                {/* Menu Icon */}
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded" aria-label="Menu">
                    <MenuIcon className="w-5 h-5" />
                </button>
                {/* Search Input */}
                <div className="flex-grow relative">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search users by name or phone..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-300 pl-10 pr-4 py-2 text-sm"
                        aria-label="Search users"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <SearchIcon className="w-5 h-5" />
                    </div>
                </div>
                {/* Filter Button */}
                <button
                    id="filter-button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border transition-colors duration-150 ${
                        showFilters ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                    } ${filtersActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                    aria-label="Toggle user filters"
                    aria-expanded={showFilters}
                >
                    <FilterIcon className="w-4 h-4" />
                    Filter {filtersActive && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                     <div ref={filterDropdownRef} className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4 animate-fadeIn">
                        {/* ... (Filter controls - no changes needed here) ... */}
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold text-gray-700">Filters</h4>
                            <button onClick={() => setShowFilters(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">User Type</label>
                            <div className="flex gap-2">
                                <button onClick={() => setUserTypeFilter('all')} className={`px-3 py-1 text-xs rounded-full border ${userTypeFilter === 'all' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>All</button>
                                <button onClick={() => setUserTypeFilter('named')} className={`px-3 py-1 text-xs rounded-full border ${userTypeFilter === 'named' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Named</button>
                                <button onClick={() => setUserTypeFilter('unnamed')} className={`px-3 py-1 text-xs rounded-full border ${userTypeFilter === 'unnamed' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Unnamed</button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Age Range</label>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="Min" value={minAgeFilter} onChange={(e) => setMinAgeFilter(e.target.value)} className="w-1/2 border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-blue-500 focus:border-blue-500" min="0" max="120" />
                                <span className="text-gray-400">-</span>
                                <input type="number" placeholder="Max" value={maxAgeFilter} onChange={(e) => setMaxAgeFilter(e.target.value)} className="w-1/2 border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-blue-500 focus:border-blue-500" min="0" max="120" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Gender</label>
                            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value as GenderFilterType)} className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs focus:ring-blue-500 focus:border-blue-500 bg-white">
                                <option value="all">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="unspecified">Unspecified</option>
                            </select>
                        </div>
                        <button onClick={resetFilters} className="w-full text-center text-xs text-blue-600 hover:underline mt-2 disabled:text-gray-400 disabled:no-underline" disabled={!filtersActive}>
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Scrollable Content Area */}
            {/* --- UPDATED: Grid now has 3 columns --- */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar class */}
                 {isLoading ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Changed to lg:grid-cols-3 */}
                        {[...Array(3)].map((_, colIndex) => ( // Render 3 placeholder columns
                             <div className="space-y-1 p-2" key={`loadCol-${colIndex}`}>
                                {Array.from({ length: 10 }).map((_, index) => <PlaceholderRow key={`load-${colIndex}-${index}`} />)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-0"> {/* Changed to lg:grid-cols-3 */}
                         {/* Map over the columns */}
                        {columnProfiles.map((col, colIndex) => (
                             <div className="space-y-0" key={`col-${colIndex}`}> {/* Removed space-y-1, mb-2 on UserItem handles spacing */}
                                {col.map((profile) => <UserItem key={profile._id} profile={profile} />)}
                            </div>
                        ))}

                        {/* Message if filters/search yield no results */}
                         {filteredProfiles.length === 0 && !isLoading && (
                            <p className="text-sm text-gray-500 p-4 text-center col-span-1 md:col-span-2 lg:col-span-3"> {/* Span all columns */}
                                {profiles.length === 0 ? 'No users found.' : 'No users match the current filters.'}
                            </p>
                         )}
                    </div>
                )}
            </div>
            {/* -------------------------------------- */}
             <p className="text-center text-gray-500 text-sm mt-4 flex-shrink-0 pt-4 border-t border-gray-200">
                 Select a user from the list above to view their details.
            </p>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
                /* Optional: Style scrollbar */
                 .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c5c5c5;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboardView;