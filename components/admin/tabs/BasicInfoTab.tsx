// seri-docker/sereinsoulchatbotui-main/components/admin/tabs/BasicInfoTab.tsx
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
    
    // --- NEW: Format location data for display ---
    const locationString = (profile.location && profile.location.city)
        ? `${profile.location.city}, ${profile.location.region}, ${profile.location.country}`
        : (profile.location && profile.location.ip) // Fallback if city is missing
        ? `IP: ${profile.location.ip}`
        : 'N/A';
    // ------------------------------------------

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* --- MODIFIED: Grid now has 2 columns, but more rows --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <EditableField
                    label="Phone Number"
                    value={profile.phoneNumber}
                    fieldName="phoneNumber"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
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

                {/* --- NEW: IP Address Field --- */}
                <EditableField
                    label="Last Known IP"
                    value={profile.ipAddress}
                    fieldName="ipAddress"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                    isEditable={false} // Not editable
                />
                
                {/* --- NEW: Location Field --- */}
                <EditableField
                    label="Approx. Location"
                    value={locationString} // Use the formatted string
                    fieldName="location" // Field name (not relevant as it's not editable)
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                    isEditable={false} // Not editable
                />
            </div>
        </div>
    );
};
export default BasicInfoTab;