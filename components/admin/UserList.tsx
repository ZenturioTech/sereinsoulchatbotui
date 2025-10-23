import React, { useState, useEffect } from 'react';

interface User {
    phoneNumber: string;
    name?: string;
    lastUpdatedAt?: string;
}

interface UserListProps {
    token: string;
    onUserSelect: (sessionId: string) => void;
    selectedSessionId: string | null;
}
const GATEKEEPER_API_KEY = import.meta.env.VITE_GATEKEEPER_API_KEY;

const UserList: React.FC<UserListProps> = ({ token, onUserSelect, selectedSessionId }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError('');
            try {
                const apiBase = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080';
                const response = await fetch(`${apiBase}/api/admin/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-api-key': GATEKEEPER_API_KEY
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch users');
                const data: User[] = await response.json();
                setUsers(data);
            } catch (err: any) {
                setError(err.message || 'Error loading users');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    if (isLoading) return <p>Loading users...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <ul className="space-y-2">
            {users.length === 0 && <p className="text-gray-500">No users found.</p>}
            {users.map((user) => (
                <li key={user.phoneNumber}>
                    <button
                        onClick={() => onUserSelect(user.phoneNumber)} // Use phone number as session ID
                        className={`w-full text-left p-2 rounded hover:bg-gray-100 ${selectedSessionId === user.phoneNumber ? 'bg-blue-100 text-blue-700 font-semibold' : ''}`}
                    >
                        {user.name || user.phoneNumber}
                        {user.name && <span className="block text-xs text-gray-500">{user.phoneNumber}</span>}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default UserList;