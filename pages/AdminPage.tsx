import React, { useState } from 'react';
import UserProfileTable from '../components/admin/UserProfileTable';
import SereinSoulLogo from '../components/icons/SereinSoulLogo';

interface AdminPageProps {
    token: string;
    onSignOut: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ token, onSignOut }) => {
    // Removed selectedSessionId state and handleUserSelect function

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar (Optional - could be removed if not needed for navigation) */}
            <aside className="w-64 bg-white p-4 border-r flex flex-col">
                <SereinSoulLogo className="w-40 mb-6" />
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Admin Menu</h2>
                {/* Add other admin navigation links here if needed */}
                <div className="mt-auto"> {/* Pushes Sign Out to bottom */}
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
                    <h1 className="text-xl font-semibold text-gray-800">Admin Panel - User Profiles</h1>
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    {/* Render the User Profile Table directly */}
                    <UserProfileTable token={token} />
                </div>
            </main>
        </div>
    );
};

export default AdminPage;