import React from 'react';
import { UserProfile } from '../../../types/UserProfile';
import EditableField from '../helpers/EditableField';

// --- MODIFIED: Define component props ---
interface TabProps {
    profile: UserProfile;
    token: string;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const FamilyInfoTab: React.FC<TabProps> = ({ profile, token, onProfileUpdate }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- MODIFIED: Pass new props down --- */}
                <EditableField
                    label="Family Structure"
                    value={profile.familyStructure}
                    fieldName="familyStructure"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                />
                <EditableField
                    label="Living Arrangement"
                    value={profile.livingArrangement}
                    fieldName="livingArrangement"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                />
                <EditableField
                    label="Family Bonding"
                    value={profile.familyBonding}
                    fieldName="familyBonding"
                    profileId={profile._id}
                    token={token}
                    onProfileUpdate={onProfileUpdate}
                />
            </div>
        </div>
    );
};
export default FamilyInfoTab;