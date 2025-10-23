import React, { useState } from 'react';
import UserList from '../components/admin/UserList';
import UserChatHistory from '../components/admin/UserChatHistory';
import SereinSoulLogo from '../components/icons/SereinSoulLogo';

interface AdminPageProps {
    token: string;
    onSignOut: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ token, onSignOut }) => {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    const handleUserSelect = (sessionId: string) => {
        setSelectedSessionId(sessionId);
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-1/4 bg-white p-4 border-r overflow-y-auto">
                <SereinSoulLogo className="w-40 mb-6" />
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Users</h2>
                <UserList token={token} onUserSelect={handleUserSelect} selectedSessionId={selectedSessionId} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="bg-white p-4 border-b flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
                    <button
                        onClick={onSignOut}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                    >
                        Sign Out
                    </button>
                </header>
                <div className="flex-1 p-4 overflow-y-auto">
                    {selectedSessionId ? (
                        <UserChatHistory token={token} sessionId={selectedSessionId} />
                    ) : (
                        <p className="text-center text-gray-500 mt-10">Select a user from the list to view their chat history.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPage;