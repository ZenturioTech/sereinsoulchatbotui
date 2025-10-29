import React from 'react';
import { UserProfile } from '../../../types/UserProfile';
import EditableField from '../helpers/EditableField';

// --- MODIFIED: Define component props ---
interface TabProps {
    profile: UserProfile;
    token: string;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const BasicInfoTab: React.FC<TabProps> = ({ profile, token, onProfileUpdate }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- MODIFIED: Pass new props down --- */}
                <EditableField
                    label="Phone Number"
                    value={profile.phoneNumber}
                    fieldName="phoneNumber"
                    profileId={profile._id} // Pass ID
                    token={token} // Pass token
                    onProfileUpdate={onProfileUpdate} // Pass callback
                    isEditable={false} // Disable editing for phone number
                />
                <EditableField
                    label="Name"
                    value={profile.name}
                    fieldName="name"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                />
                <EditableField
                    label="Age"
                    value={profile.age}
                    fieldName="age"
                    type="number"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                />
                <EditableField
                    label="Gender"
                    value={profile.gender}
                    fieldName="gender"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                />
            </div>
        </div>
    );
};
export default BasicInfoTab;