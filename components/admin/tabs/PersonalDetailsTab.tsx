import React from 'react';
import { UserProfile } from '../../../types/UserProfile';
import EditableField from '../helpers/EditableField';

// --- MODIFIED: Define component props ---
interface TabProps {
    profile: UserProfile;
    token: string;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const PersonalDetailsTab: React.FC<TabProps> = ({ profile, token, onProfileUpdate }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- MODIFIED: Pass new props down --- */}
                <EditableField
                    label="Education"
                    value={profile.educationalQualification}
                    fieldName="educationalQualification"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                />
                <EditableField
                    label="Occupation"
                    value={profile.occupation}
                    fieldName="occupation"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                />
                <EditableField
                    label="Religion"
                    value={profile.religion}
                    fieldName="religion"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                />
                <EditableField
                    label="Marital Status"
                    value={profile.maritalStatus}
                    fieldName="maritalStatus"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                />
            </div>
        </div>
    );
};
export default PersonalDetailsTab;