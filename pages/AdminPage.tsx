// seri-docker/sereinsoulchatbotui-main/pages/AdminPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import SereinSoulLogo from '../components/icons/SereinSoulLogo';
import UserProfileTabs from '../components/admin/UserProfileTabs';
import AdminDashboardView from '../components/admin/AdminDashboardView';
import { UserProfile } from '../types/UserProfile';

// Simple Back Arrow Icon
const BackArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);


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

    const fetchUserProfiles = useCallback(async (selectProfileId: string | null = null) => {
        setError('');
        // Don't set isLoading true here if just selecting, let initial load handle it
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
            setProfiles(data); // Always update the full list

            // Re-select if needed (e.g., after update)
            if (selectProfileId) {
                const profileToSelect = data.find(p => p._id === selectProfileId) || null;
                setSelectedProfile(profileToSelect);
            }

        } catch (err: any) {
            setError(err.message || 'Error loading user profiles');
            setProfiles([]);
            setSelectedProfile(null);
        } finally {
            // Set loading false only after the *initial* fetch
             if (isLoading) setIsLoading(false);
        }
    }, [token, isLoading]); // Depend on isLoading to set it false

    useEffect(() => {
        setIsLoading(true); // Set loading true on mount/token change
        fetchUserProfiles();
    }, [token]); // fetchUserProfiles itself doesn't need to be in deps if token is

    const handleProfileUpdate = (updatedProfile: UserProfile) => {
        setProfiles(prevProfiles =>
            prevProfiles.map(p =>
                p._id === updatedProfile._id ? updatedProfile : p
            )
        );
        setSelectedProfile(updatedProfile); // Keep updated profile selected
    };

    // --- Function to clear selection and show dashboard ---
    const showDashboard = () => {
        setSelectedProfile(null);
    };

    return (
        <div className="flex h-screen bg-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {/* Sidebar */}
            <aside className="w-64 bg-white p-4 border-r flex flex-col flex-shrink-0">
                <SereinSoulLogo className="w-40 mb-6" />

                {/* --- UPDATED Sidebar Content --- */}
                {selectedProfile ? (
                    // If a user is selected, show "Back" and the selected user
                     <>
                        <button
                            onClick={showDashboard}
                            className="flex items-center text-sm text-blue-600 hover:underline mb-3 px-1 py-1 group"
                        >
                            <BackArrowIcon className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                            All Users
                        </button>
                        <h2 className="text-lg font-semibold mb-2 text-gray-700 px-1 border-t pt-3">SELECTED USER</h2>
                        <div className="flex-1 overflow-y-auto -mx-4">
                             <div className="px-4 py-2.5 bg-blue-50 border-l-4 border-blue-500"> {/* Highlight selected */}
                                <p className="text-sm font-semibold text-blue-800 truncate">
                                     {selectedProfile.name || selectedProfile.phoneNumber}
                                </p>
                                {selectedProfile.name && (
                                     <p className="text-xs text-blue-600 truncate">{selectedProfile.phoneNumber}</p>
                                )}
                            </div>
                         </div>
                    </>
                ) : (
                    // If no user is selected, just show the USERS heading
                     <>
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">USERS</h2>
                        <div className="flex-1 overflow-y-auto -mx-4">
                            {/* Optional: Add a message or keep empty */}
                             <p className="text-sm text-gray-500 px-4">User list displayed in main view.</p>
                        </div>
                    </>
                )}
                {/* ----------------------------- */}

                <div className="mt-auto pt-4 border-t border-gray-200">
                     <button
                        onClick={onSignOut}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
                <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto"> {/* Keep this scrollable */}
                    {error && <p className="text-center p-4 text-red-500">{error}</p>}

                    {selectedProfile ? (
                        // Show tabs if a profile is selected
                         <UserProfileTabs
                            key={selectedProfile._id} // Re-render when profile changes
                            profile={selectedProfile}
                            token={token}
                            onProfileUpdate={handleProfileUpdate}
                        />
                    ) : (
                        // --- MODIFIED: Added h1 title here ---
                        <>
                            <h1 className="text-2xl font-semibold text-gray-800 mb-4">USERS OVERVIEW</h1>
                            <AdminDashboardView
                                profiles={profiles}
                                isLoading={isLoading}
                                onSelectProfile={setSelectedProfile} // Pass the state setter
                            />
                        </>
                        // ------------------------------------
                    )}
                </div>
            </main>

            {/* Modal Keyframes */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUpFade { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default AdminPage;