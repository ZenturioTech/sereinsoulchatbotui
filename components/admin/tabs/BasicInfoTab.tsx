import React from 'react';
import { UserProfile } from '../../../types/UserProfile';
import EditableField from '../helpers/EditableField';

const BasicInfoTab: React.FC<{ profile: UserProfile }> = ({ profile }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableField label="Phone Number" value={profile.phoneNumber} />
                <EditableField label="Name" value={profile.name} />
                <EditableField label="Age" value={profile.age} />
                <EditableField label="Gender" value={profile.gender} />
            </div>
        </div>
    );
};
export default BasicInfoTab;