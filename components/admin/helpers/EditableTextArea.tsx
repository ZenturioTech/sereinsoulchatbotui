import React from 'react';
import EditIcon from './EditIcon';

interface EditableTextAreaProps {
    label: string;
    value: string | number | null | undefined;
    rows?: number;
}

const EditableTextArea: React.FC<EditableTextAreaProps> = ({ label, value, rows = 6 }) => {
    return (
        <div className="w-full">
            <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
                {label}
                <button className="ml-2 text-gray-400 hover:text-blue-500">
                    <EditIcon />
                </button>
            </label>
            <div 
                className="bg-gray-200 text-gray-800 text-sm rounded px-3 py-2 w-full"
                style={{ height: `${rows * 1.5}rem` }} // Simple height control
            >
                {value || ''}
            </div>
        </div>
    );
};

export default EditableTextArea;