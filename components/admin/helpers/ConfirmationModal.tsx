// seri-docker/sereinsoulchatbotui-main/components/admin/helpers/ConfirmationModal.tsx
import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmButtonClass = "bg-blue-600 hover:bg-blue-700"
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ease-out"
            style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
            onClick={onCancel} // Close if clicking overlay
        >
            <div
                className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm transition-all duration-300 ease-out transform scale-95 opacity-0"
                style={{ animation: 'scaleUpFade 0.3s ease-out 0.1s forwards' }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">{title}</h3>
                <p className="text-md text-gray-600 mb-6 text-center">
                    {message}
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-full text-md font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2 rounded-full text-md font-medium text-white ${confirmButtonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;