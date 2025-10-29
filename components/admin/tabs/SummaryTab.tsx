import React from 'react';
import { UserProfile } from '../../../types/UserProfile';
import EditableTextArea from '../helpers/EditableTextArea';

// --- MODIFIED: Define component props ---
interface TabProps {
    profile: UserProfile;
    token: string;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const SummaryTab: React.FC<TabProps> = ({ profile, token, onProfileUpdate }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     {/* --- MODIFIED: Pass new props down --- */}
                    <EditableTextArea
                        label="Summary"
                        value={profile.summary} // Use direct access if added to type
                        fieldName="summary"
                        rows={8}
                        profileId={profile._id}
                        token={token}
                        onProfileUpdate={onProfileUpdate}
                    />
                </div>
                <div>
                     {/* --- MODIFIED: Pass new props down --- */}
                    <EditableTextArea
                        label="Notes"
                        value={profile.notes} // Use direct access if added to type
                        fieldName="notes"
                        rows={8}
                        profileId={profile._id}
                        token={token}
                        onProfileUpdate={onProfileUpdate}
                    />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Edit History</h3>
                <div className="bg-gray-200 rounded p-4 h-40 w-full overflow-y-auto">
                    {/* Edit history would be listed here */}
                    <p className="text-sm text-gray-500">No edit history available.</p>
                </div>
            </div>
        </div>
    );
};
export default SummaryTab;