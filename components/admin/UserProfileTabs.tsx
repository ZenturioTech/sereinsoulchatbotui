// seri-docker/sereinsoulchatbotui-main/components/admin/UserProfileTabs.tsx
import React, { useState } from 'react';
import { UserProfile } from '../../types/UserProfile';
import BasicInfoTab from './tabs/BasicInfoTab';
import PersonalDetailsTab from './tabs/PersonalDetailsTab';
import FamilyInfoTab from './tabs/FamilyInfoTab';
import SummaryTab from './tabs/SummaryTab';
import AnalyzesTab from './tabs/AnalyzesTab'; // Ensure this is imported

interface UserProfileTabsProps {
    profile: UserProfile;
    token: string;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
}

type TabName = 'basic' | 'personal' | 'family' | 'summary' | 'analyzes' | 'empty';

const UserProfileTabs: React.FC<UserProfileTabsProps> = ({ profile, token, onProfileUpdate }) => {
    const [activeTab, setActiveTab] = useState<TabName>('basic');

    const renderTabContent = () => {
        const commonProps = {
            profile: profile,
            token: token,
            onProfileUpdate: onProfileUpdate
        };

        switch (activeTab) {
            case 'basic':
                return <BasicInfoTab {...commonProps} />;
            case 'personal':
                return <PersonalDetailsTab {...commonProps} />;
            case 'family':
                return <FamilyInfoTab {...commonProps} />;
            case 'summary':
                return <SummaryTab {...commonProps} />;
            case 'analyzes':
                return <AnalyzesTab {...commonProps} />; // Render the AnalyzesTab
            case 'empty':
                return <div className="bg-white p-6 rounded-lg shadow-sm h-96">Empty Content...</div>; // Adjust height as needed
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ name: TabName; label: string }> = ({ name, label }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === name
                    ? 'bg-gray-300 text-gray-900'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="w-full">
             <div className="flex justify-between items-center mb-4">
                 <h1 className="text-2xl font-semibold text-gray-800">USER PROFILE DETAILS</h1>
             </div>

            {/* Tab Navigation */}
            <nav className="flex space-x-2 mb-4">
                <TabButton name="basic" label="Basic Information" />
                <TabButton name="personal" label="Personal Details" />
                <TabButton name="family" label="Family Information" />
                <TabButton name="summary" label="Summary" />
                <TabButton name="analyzes" label="Analyzes" />
                <TabButton name="empty" label="Empty" />
            </nav>

            {/* Tab Content */}
            <div className="w-full">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default UserProfileTabs;