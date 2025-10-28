import React from 'react';
import { UserProfile } from '../../../types/UserProfile';
import EditableField from '../helpers/EditableField';

const FamilyInfoTab: React.FC<{ profile: UserProfile }> = ({ profile }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableField label="Family Structure" value={profile.familyStructure} />
                <EditableField label="Living Arrangement" value={profile.livingArrangement} />
                <EditableField label="Family Bonding" value={profile.familyBonding} />
            </div>
        </div>
    );
};
export default FamilyInfoTab;