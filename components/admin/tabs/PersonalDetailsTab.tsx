import React from 'react';
import { UserProfile } from '../../../types/UserProfile';
import EditableField from '../helpers/EditableField';

const PersonalDetailsTab: React.FC<{ profile: UserProfile }> = ({ profile }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableField label="Education" value={profile.educationalQualification} />
                <EditableField label="Occupation" value={profile.occupation} />
                <EditableField label="Religion" value={profile.religion} />
                <EditableField label="Marital Status" value={profile.maritalStatus} />
            </div>
        </div>
    );
};
export default PersonalDetailsTab;