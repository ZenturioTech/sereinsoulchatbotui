// seri-docker/sereinsoulchatbotui-main/components/admin/helpers/EditableField.tsx
import React, { useState, useEffect } from 'react';
import EditIcon from './EditIcon';
import { UserProfile } from '../../../types/UserProfile';
import ConfirmationModal from './ConfirmationModal'; // Import Modal

interface EditableFieldProps {
    label: string;
    value: string | number | null | undefined;
    fieldName: keyof UserProfile;
    profileId: string;
    token: string;
    onProfileUpdate: (updatedProfile: UserProfile) => void;
    type?: 'text' | 'number' | 'date';
    isEditable?: boolean;
}

const GATEKEEPER_API_KEY = (import.meta as any).env.VITE_GATEKEEPER_API_KEY;

const EditableField: React.FC<EditableFieldProps> = ({
    label,
    value,
    fieldName,
    profileId,
    token,
    onProfileUpdate,
    type = 'text',
    isEditable = true
}) => {

    const [isFieldEditing, setIsFieldEditing] = useState(false);
    const [fieldValue, setFieldValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {
        setFieldValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(e.target.value);
        setError('');
    };

    const confirmSave = async () => {
        setShowSaveConfirm(false);
        setIsSaving(true);
        setError('');

        let valueToSave: string | number | null = fieldValue;
        if (type === 'number') {
            const num = parseInt(String(fieldValue), 10);
            if (isNaN(num)) {
                 setError('Please enter a valid number.');
                 setIsSaving(false);
                 return;
            }
             if (fieldName === 'age' && (num < 0 || num > 120)) { // Specific validation moved here
                 setError('Age must be between 0 and 120.');
                 setIsSaving(false);
                 return;
             }
            valueToSave = num;
        } else if (String(valueToSave).trim() === '') { // Trim whitespace before checking empty
             valueToSave = null;
        } else {
            valueToSave = String(valueToSave).trim(); // Trim non-empty strings
        }


        try {
            const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080';
            const response = await fetch(`${apiBase}/api/admin/user/${profileId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'x-api-key': GATEKEEPER_API_KEY
                },
                body: JSON.stringify({ [fieldName]: valueToSave })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Failed to save ${label}`);
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
        setShowCancelConfirm(false);
        setFieldValue(value);
        setIsFieldEditing(false);
        setError('');
    };

    const handleSaveClick = () => {
        // Run validation before showing modal
        if (type === 'number') {
            const numVal = String(fieldValue).trim(); // Trim value before parsing
             if (numVal === '') { // Allow saving empty number field (becomes null)
                setError('');
                setShowSaveConfirm(true);
                return;
             }
            const num = parseInt(numVal, 10);
            if (isNaN(num)) {
                setError('Please enter a valid number.');
                return;
            }
             if (fieldName === 'age' && (num < 0 || num > 120)) {
                 setError('Age must be between 0 and 120.');
                 return;
             }
        }
        // Add validation for other types if needed
        setError('');
        setShowSaveConfirm(true); // Show confirmation
    };

    const handleCancelClick = () => {
        // Only show confirm modal if changes were made
        if (fieldValue !== value) {
            setShowCancelConfirm(true);
        } else {
            // If no changes, just exit edit mode directly
            setIsFieldEditing(false);
            setError('');
        }
    };

    return (
        <div className="w-full">
            <ConfirmationModal
                isOpen={showSaveConfirm}
                title="Confirm Save"
                message="Are you sure you want to save the changes?"
                onConfirm={confirmSave}
                onCancel={() => setShowSaveConfirm(false)}
                confirmText="Save"
            />
            <ConfirmationModal
                isOpen={showCancelConfirm}
                title="Confirm Cancel"
                message="Are you sure you want to discard the changes?"
                onConfirm={confirmCancel}
                onCancel={() => setShowCancelConfirm(false)}
                confirmText="Discard"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />

            <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                {label}
                {isEditable && !isFieldEditing && (
                    <button
                        onClick={() => setIsFieldEditing(true)}
                        className="ml-2 text-gray-400 hover:text-blue-500 disabled:opacity-50"
                        aria-label={`Edit ${label}`}
                        disabled={isSaving}
                    >
                        <EditIcon />
                    </button>
                )}
            </label>

            {isFieldEditing ? (
                <div className="flex items-center space-x-2">
                    <input
                        type={type}
                        value={fieldValue ?? ''} // Handle null/undefined for input value
                        onChange={handleChange}
                        className={`flex-grow bg-white text-gray-800 text-sm rounded px-3 py-2 h-9 border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        autoFocus
                    />
                    <button
                        onClick={handleSaveClick}
                        disabled={isSaving}
                        className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-400"
                    >
                        {isSaving ? '...' : 'Save'}
                    </button>
                    <button
                        onClick={handleCancelClick}
                        disabled={isSaving}
                        className="px-3 py-1 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                 <div className="bg-gray-200 text-gray-800 text-sm rounded px-3 py-2 overflow-hidden min-h-9 flex items-center min-w-[200px] w-full">
                    {/* Display 'N/A' or similar for null/undefined/empty values */}
                    {value === null || value === undefined || String(value).trim() === '' ? <span className="text-gray-500 italic">N/A</span> : String(value)}
                </div>
            )}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default EditableField;