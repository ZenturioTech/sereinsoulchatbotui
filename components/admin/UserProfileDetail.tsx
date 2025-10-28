import React from 'react';
import { UserProfile } from '../../types/UserProfile'; // Import the shared interface

interface UserProfileDetailProps {
    profile: UserProfile;
}

// Helper component for a single row of information
const DetailRow: React.FC<{ label: string; value: string | number | null | undefined }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'N/A'}</dd>
    </div>
);

// Helper component for a card section
const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-4 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
            <dl className="divide-y divide-gray-200">
                {children}
            </dl>
        </div>
    </div>
);

const UserProfileDetail: React.FC<UserProfileDetailProps> = ({ profile }) => {
    
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
        <div className="max-w-7xl mx-auto">

            {/* Top Profile Header Card */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-5">
                    {/* Avatar Placeholder */}
                    <div className="flex-shrink-0 h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : profile.phoneNumber.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{profile.name || 'Unnamed User'}</h2>
                        <p className="text-sm font-medium text-gray-500">Phone: {profile.phoneNumber}</p>
                        <p className="text-sm font-medium text-gray-500">Occupation: {profile.occupation || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Grid for Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Personal Information Card */}
                <InfoCard title="Personal Information">
                    <DetailRow label="Full Name" value={profile.name} />
                    <DetailRow label="Phone Number" value={profile.phoneNumber} />
                    <DetailRow label="Age" value={profile.age} />
                    <DetailRow label="Gender" value={profile.gender} />
                    <DetailRow label="Marital Status" value={profile.maritalStatus} />
                    <DetailRow label="Religion" value={profile.religion} />
                    <DetailRow label="Last Updated" value={formatDate(profile.lastUpdatedAt)} />
                </InfoCard>

                {/* Background Information Card */}
                <InfoCard title="Background Information">
                    <DetailRow label="Education" value={profile.educationalQualification} />
                    <DetailRow label="Occupation" value={profile.occupation} />
                    <DetailRow label="Family Structure" value={profile.familyStructure} />
                    <DetailRow label="Living Arrangement" value={profile.livingArrangement} />
                    <DetailRow label="Family Bonding" value={profile.familyBonding} />
                </InfoCard>

            </div>
        </div>
    );
};

export default UserProfileDetail;