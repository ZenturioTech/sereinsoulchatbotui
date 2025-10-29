// seri-docker/sereinsoulchatbotui-main/components/admin/helpers/EditableTextArea.tsx
import React, { useState, useEffect } from 'react';
import EditIcon from './EditIcon';
import { UserProfile } from '../../../types/UserProfile';
import ConfirmationModal from './ConfirmationModal';

interface EditableTextAreaProps {
    label: string;
    value: string | number | null | undefined;
    rows?: number;
    fieldName: keyof UserProfile;
    profileId: string;
    token: string;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
    isEditable?: boolean; // Keep the prop
}

const GATEKEEPER_API_KEY = (import.meta as any).env.VITE_GATEKEEPER_API_KEY;

const EditableTextArea: React.FC<EditableTextAreaProps> = ({
    label,
    value,
    rows = 6,
    fieldName,
    profileId,
    token,
    onProfileUpdate,
    isEditable = true // Default to editable
}) => {

    const [isFieldEditing, setIsFieldEditing] = useState(false);
    const [fieldValue, setFieldValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {
        // Update internal state only if editable and value changes externally, and not currently editing
         if (isEditable && value !== fieldValue && !isFieldEditing) {
            setFieldValue(value);
        } else if (!isEditable) {
             // If not editable, always ensure internal state matches external prop
             setFieldValue(value);
        }
    }, [value, isEditable, isFieldEditing, fieldValue]);

    // --- Handlers only relevant if editable ---
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isEditable) return; // Prevent changes if not editable
        setFieldValue(e.target.value);
         setError('');
    };

    const confirmSave = async () => {
        if (!isEditable) return;
        setShowSaveConfirm(false);
        setIsSaving(true);
        setError('');
        const valueToSave = String(fieldValue).trim() === '' ? null : String(fieldValue).trim();

        try {
            const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080';
            const response = await fetch(`${apiBase}/api/admin/user/${profileId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'x-api-key': GATEKEEPER_API_KEY },
                body: JSON.stringify({ [fieldName]: valueToSave })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Failed to save ${label || fieldName}`);
            }

            const updatedProfile: UserProfile = await response.json();
            onProfileUpdate(updatedProfile);
            setIsFieldEditing(false);

        } catch (err: any) {
            console.error(`Save error for ${fieldName}:`, err);
            setError(err.message || 'Could not save.');
        } finally {
            setIsSaving(false);
        }
    };

    const confirmCancel = () => {
        if (!isEditable) return;
        setShowCancelConfirm(false);
        setFieldValue(value);
        setIsFieldEditing(false);
        setError('');
    };

    const handleSaveClick = () => {
        if (!isEditable) return;
        setError('');
        setShowSaveConfirm(true);
    };

    const handleCancelClick = () => {
        if (!isEditable) return;
        if (fieldValue !== value) {
            setShowCancelConfirm(true);
        } else {
            setIsFieldEditing(false);
            setError('');
        }
    };
    // --- End handlers ---


    const minHeight = `${rows * 1.5}rem`;
    const maxHeight = `${rows * 2.5}rem`;

    return (
        <div className="w-full">
            {/* Render Modals only if editable */}
            {isEditable && (
                <>
                    <ConfirmationModal isOpen={showSaveConfirm} title="Confirm Save" message="Are you sure you want to save the changes?" onConfirm={confirmSave} onCancel={() => setShowSaveConfirm(false)} confirmText="Save" />
                    <ConfirmationModal isOpen={showCancelConfirm} title="Confirm Cancel" message="Are you sure you want to discard the changes?" onConfirm={confirmCancel} onCancel={() => setShowCancelConfirm(false)} confirmText="Discard" confirmButtonClass="bg-red-600 hover:bg-red-700" />
                </>
            )}

            {/* Label and optional Edit Icon */}
            <div className="flex items-center mb-1">
                {/* Display the label */}
                {label && <label className="text-sm font-medium text-gray-600 mr-2">{label}</label>}

                {/* **CRITICAL CHECK:** Only display the button if isEditable is true AND we are not currently editing */}
                {isEditable && !isFieldEditing && (
                    <button
                        onClick={() => setIsFieldEditing(true)}
                        className="text-gray-400 hover:text-blue-500 disabled:opacity-50"
                        aria-label={`Edit ${label || fieldName}`}
                        // Disable button if a save is in progress (though unlikely in display mode)
                        disabled={isSaving}
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Conditional Rendering: Edit Mode vs Display Mode */}
            {isEditable && isFieldEditing ? (
                // EDITING MODE (Only if isEditable is true)
                <div>
                    <textarea value={fieldValue ?? ''} onChange={handleChange} rows={rows} className={`bg-white text-gray-800 text-sm rounded px-3 py-2 w-full border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`} style={{ minHeight }} autoFocus />
                     {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    <div className="flex items-center space-x-2 mt-2">
                         <button onClick={handleSaveClick} disabled={isSaving} className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-400"> {isSaving ? '...' : 'Save'} </button>
                        <button onClick={handleCancelClick} disabled={isSaving} className="px-3 py-1 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"> Cancel </button>
                    </div>
                </div>
            ) : (
                // DISPLAY MODE (Rendered if !isEditable OR if isEditable but !isFieldEditing)
                <div
                    // Make non-clickable and remove hover effect if not editable
                    className={`bg-gray-100 border border-gray-200 text-gray-800 text-sm rounded px-3 py-2 w-full whitespace-pre-wrap overflow-y-auto ${isEditable ? 'cursor-pointer hover:bg-gray-200 transition-colors duration-150' : 'cursor-default'}`} // Added cursor-default when not editable
                    style={{ minHeight: minHeight, maxHeight: maxHeight }}
                    // Only allow clicking to edit if isEditable
                    onClick={isEditable ? () => setIsFieldEditing(true) : undefined}
                >
                     {value === null || value === undefined || String(value).trim() === '' ? <span className="text-gray-500 italic">N/A</span> : String(value)}
                </div>
            )}
        </div>
    );
};

export default EditableTextArea;