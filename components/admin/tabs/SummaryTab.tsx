// seri-docker/sereinsoulchatbotui-main/components/admin/tabs/SummaryTab.tsx
import React, { useState, useMemo } from 'react';
import { UserProfile, EditHistoryEntry } from '../../../types/UserProfile';
import EditableTextArea from '../helpers/EditableTextArea';

const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);


interface TabProps {
    profile: UserProfile;
    token: string;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
}
const GATEKEEPER_API_KEY = (import.meta as any).env.VITE_GATEKEEPER_API_KEY;

const SummaryTab: React.FC<TabProps> = ({ profile, token, onProfileUpdate }) => {
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    const handleGenerateSummary = async () => {
        setIsSummarizing(true);
        setSummaryError(null);
        try {
            const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080';
            const response = await fetch(`${apiBase}/api/admin/user/${profile._id}/summarize`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'x-api-key': GATEKEEPER_API_KEY
                },
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Failed to generate summary (Status: ${response.status})`);
            }

            const updatedProfile: UserProfile = await response.json();
            onProfileUpdate(updatedProfile);

        } catch (err: any) {
            console.error('Summary generation error:', err);
            setSummaryError(err.message || 'An unexpected error occurred during summarization.');
        } finally {
            setIsSummarizing(false);
        }
    };

    const formatTimestamp = (isoString?: string): string => {
        if (!isoString) return 'Invalid Date';
        try {
            return new Date(isoString).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: 'numeric', minute: '2-digit', hour12: true
            });
        } catch { return 'Invalid Date'; }
    };

    const relevantHistory = useMemo(() => {
        return (profile.editHistory || [])
            .filter(entry => entry.field === 'summary' || entry.field === 'notes')
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [profile.editHistory]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Summary Area */}
                    {/* --- REMOVED extra label, MOVED button below --- */}
                    {summaryError && <p className="text-red-500 text-xs mt-1 mb-2">{summaryError}</p>}
                    <EditableTextArea
                        label="Summary" // Label is now correctly handled by EditableTextArea
                        value={profile.summary}
                        fieldName="summary"
                        rows={8}
                        profileId={profile._id}
                        token={token}
                        onProfileUpdate={onProfileUpdate}
                        isEditable={false} // Summary is display-only
                    />
                    {/* --- MOVED Button Below Text Area --- */}
                    <div className="flex justify-end mt-2">
                         <button
                            onClick={handleGenerateSummary}
                            disabled={isSummarizing}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-colors ${
                                isSummarizing
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                            }`}
                        >
                             <RefreshIcon className={`w-3 h-3 ${isSummarizing ? 'animate-spin' : ''}`} />
                            {isSummarizing ? 'Generating...' : 'Regenerate Summary'}
                        </button>
                    </div>
                     {/* ----------------------------------- */}
                </div>
                <div>
                    {/* Notes Area */}
                    <EditableTextArea
                        label="Notes"
                        value={profile.notes}
                        fieldName="notes"
                        rows={8}
                        profileId={profile._id}
                        token={token}
                        onProfileUpdate={onProfileUpdate}
                        // isEditable defaults to true
                    />
                </div>
            </div>

            {/* Edit History Display */}
            <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2 border-t pt-4">Edit History (Summary & Notes)</h3>
                <div className="bg-gray-50 rounded p-4 h-40 w-full overflow-y-auto border border-gray-200 space-y-2">
                    {relevantHistory.length > 0 ? (
                        relevantHistory.map((entry, index) => (
                            <div key={index} className="text-xs text-gray-700 border-b border-gray-200 pb-1 mb-1 last:border-b-0">
                                <span className="font-medium capitalize">{entry.field}</span> updated on{' '}
                                <span className="text-gray-900">{formatTimestamp(entry.timestamp)}</span>
                                {' '}by <span className="text-gray-900">{entry.admin}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No edit history available for Summary or Notes.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default SummaryTab;