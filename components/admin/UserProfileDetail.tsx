import React from 'react';
import { UserProfile } from '../../types/UserProfile';

interface UserProfileDetailProps {
    profile: UserProfile;
}

const UserProfileDetail: React.FC<UserProfileDetailProps> = ({ profile }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
                {/* Basic Information */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Phone Number</label>
                            <p className="mt-1 text-gray-900">{profile.phoneNumber}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Name</label>
                            <p className="mt-1 text-gray-900">{profile.name || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Age</label>
                            <p className="mt-1 text-gray-900">{profile.age || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Gender</label>
                            <p className="mt-1 text-gray-900">{profile.gender || 'Not provided'}</p>
                        </div>
                    </div>
                </section>

                {/* Personal Details */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Education</label>
                            <p className="mt-1 text-gray-900">{profile.educationalQualification || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Occupation</label>
                            <p className="mt-1 text-gray-900">{profile.occupation || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Religion</label>
                            <p className="mt-1 text-gray-900">{profile.religion || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Marital Status</label>
                            <p className="mt-1 text-gray-900">{profile.maritalStatus || 'Not provided'}</p>
                        </div>
                    </div>
                </section>

                {/* Family Information */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Family Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Family Structure</label>
                            <p className="mt-1 text-gray-900">{profile.familyStructure || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Living Arrangement</label>
                            <p className="mt-1 text-gray-900">{profile.livingArrangement || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Family Bonding</label>
                            <p className="mt-1 text-gray-900">{profile.familyBonding || 'Not provided'}</p>
                        </div>
                    </div>
                </section>

                {/* Last Updated */}
                <section className="border-t pt-4">
                    <div className="text-sm text-gray-500">
                        Last Updated: {profile.lastUpdatedAt 
                            ? new Date(profile.lastUpdatedAt).toLocaleString()
                            : 'Never'}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserProfileDetail;
