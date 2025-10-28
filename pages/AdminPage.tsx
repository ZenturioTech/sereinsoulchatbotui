import React, { useState, useEffect } from 'react';
import SereinSoulLogo from '../components/icons/SereinSoulLogo';
import UserProfileDetail from '../components/admin/UserProfileDetail'; // We will create this
import { UserProfile } from '../types/UserProfile'; // Import the new type

interface AdminPageProps {
    token: string;
    onSignOut: () => void;
}

const GATEKEEPER_API_KEY = (import.meta as any).env.VITE_GATEKEEPER_API_KEY;

const AdminPage: React.FC<AdminPageProps> = ({ token, onSignOut }) => {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetches all user profiles to populate the sidebar
    useEffect(() => {
        const fetchUserProfiles = async () => {
            setIsLoading(true);
            setError('');
            try {
                const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080';
                const response = await fetch(`${apiBase}/api/admin/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-api-key': GATEKEEPER_API_KEY
                    }
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Failed to fetch user profiles');
                }
                const data: UserProfile[] = await response.json();
                setProfiles(data);
                // Automatically select the first user in the list
                if (data.length > 0) {
                    setSelectedProfile(data[0]);
                }
            } catch (err: any) {
                setError(err.message || 'Error loading user profiles');
                console.error("Fetch profiles error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfiles();
    }, [token]);

    return (
        <div className="flex h-screen bg-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {/* Sidebar */}
            <aside className="w-64 bg-white p-4 border-r flex flex-col">
                <SereinSoulLogo className="w-40 mb-6" />
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Users</h2>
                
                {/* User List */}
                <div className="flex-1 overflow-y-auto -mx-4">
                    {isLoading && <p className="text-sm text-gray-500 px-4">Loading users...</p>}
                    {error && <p className="text-sm text-red-500 px-4">{error}</p>}
                    {!isLoading && !error && profiles.length === 0 && (
                        <p className="text-sm text-gray-500 px-4">No users found.</p>
                    )}
                    <ul>
                        {profiles.map((profile) => (
                            <li key={profile._id}>
                                <button
                                    onClick={() => setSelectedProfile(profile)}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium truncate ${
                                        selectedProfile?._id === profile._id
                                            ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {/* Use name, or fallback to phone number */}
                                    {profile.name || profile.phoneNumber}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="mt-auto">
                     <button
                        onClick={onSignOut}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="bg-white p-4 border-b">
                    <h1 className="text-xl font-semibold text-gray-800">
                        User Profile Details
                    </h1>
                </header>
                <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
                    {isLoading && <p className="text-center p-4">Loading profile...</p>}
                    {error && <p className="text-center p-4 text-red-500">Could not load users.</p>}
                    
                    {/* Render the detail component if a user is selected */}
                    {!isLoading && !error && selectedProfile && (
                        <UserProfileDetail profile={selectedProfile} />
                    )}
                    
                    {/* Handle cases where no user is selected or found */}
                    {!isLoading && !error && !selectedProfile && (
                        <p className="text-center p-4 text-gray-500">
                            {profiles.length > 0 ? 'Select a user from the list to view details.' : 'No user profiles found.'}
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPage;