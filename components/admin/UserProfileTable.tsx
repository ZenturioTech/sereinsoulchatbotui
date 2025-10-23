// ./frontend/components/admin/UserProfileTable.tsx
import React, { useState, useEffect } from 'react';

// Define the structure matching the user_profile collection
interface UserProfile {
    _id: string; // MongoDB default ID
    phoneNumber: string;
    name?: string | null;
    age?: number | null;
    gender?: string | null;
    lastUpdatedAt?: string;
    // Add other fields from your sensitiveDataMap as needed
    educationalQualification?: string | null;
    occupation?: string | null;
    religion?: string | null;
    maritalStatus?: string | null;
    familyStructure?: string | null;
    livingArrangement?: string | null;
    familyBonding?: string | null;
    // ... add any other fields stored in user_profile
}

interface UserProfileTableProps {
    token: string;
}
const GATEKEEPER_API_KEY = import.meta.env.VITE_GATEKEEPER_API_KEY;

const UserProfileTable: React.FC<UserProfileTableProps> = ({ token }) => {
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfiles = async () => {
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
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Failed to fetch user profiles');
                }
                const data: UserProfile[] = await response.json();
                setProfiles(data);
            } catch (err: any) {
                setError(err.message || 'Error loading user profiles');
                console.error("Fetch profiles error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfiles();
    }, [token]);

    if (isLoading) return <p className="text-center p-4">Loading user profiles...</p>;
    if (error) return <p className="text-center p-4 text-red-500">{error}</p>;
    if (profiles.length === 0) return <p className="text-center p-4 text-gray-500">No user profiles found.</p>;

    // Helper to format date nicely
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return 'Invalid Date';
        }
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* Define Table Headers */}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marital Status</th>
                        {/* Add more headers for other fields you want to display */}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {profiles.map((profile) => (
                        <tr key={profile.phoneNumber}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{profile.phoneNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.name || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.age || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.gender || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.educationalQualification || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.occupation || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.maritalStatus || 'N/A'}</td>
                            {/* Add more cells for other fields */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(profile.lastUpdatedAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserProfileTable;