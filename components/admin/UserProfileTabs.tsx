import React, { useState } from 'react';
import { UserProfile } from '../../types/UserProfile';
import BasicInfoTab from './tabs/BasicInfoTab';
import PersonalDetailsTab from './tabs/PersonalDetailsTab';
import FamilyInfoTab from './tabs/FamilyInfoTab';
import SummaryTab from './tabs/SummaryTab';

interface UserProfileTabsProps {
    profile: UserProfile;
}

type TabName = 'basic' | 'personal' | 'family' | 'summary' | 'analyzes' | 'empty';

const UserProfileTabs: React.FC<UserProfileTabsProps> = ({ profile }) => {
    const [activeTab, setActiveTab] = useState<TabName>('basic');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return <BasicInfoTab profile={profile} />;
            case 'personal':
                return <PersonalDetailsTab profile={profile} />;
            case 'family':
                return <FamilyInfoTab profile={profile} />;
            case 'summary':
                return <SummaryTab profile={profile} />;
            case 'analyzes':
                return <div className="bg-white p-6 rounded-lg shadow-sm h-96">Analyzes Content...</div>;
            case 'empty':
                return <div className="bg-white p-6 rounded-lg shadow-sm h-96">Empty Content...</div>;
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
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">USER PROFILE DETAILS</h1>
            
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