import React from 'react';
import EditIcon from './EditIcon';

interface EditableFieldProps {
    label: string;
    value: string | number | null | undefined;
}

const EditableField: React.FC<EditableFieldProps> = ({ label, value }) => {
    return (
        <div className="w-full">
            <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                {label}
                <button className="ml-2 text-gray-400 hover:text-blue-500">
                    <EditIcon />
                </button>
            </label>
            <div className="bg-gray-200 text-gray-800 text-sm rounded px-3 py-2 h-9 min-w-[200px]">
                {value || ''}
            </div>
        </div>
    );
};

export default EditableField;