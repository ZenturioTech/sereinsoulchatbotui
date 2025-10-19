// ./frontend/pages/ChatPage.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios'; // Or use fetch if you prefer
import DiamondIcon from '../components/icons/DiamondIcon';
import LockIcon from '../components/icons/LockIcon';
import EmojiIcon from '../components/icons/EmojiIcon';
import PaperclipIcon from '../components/icons/PaperclipIcon';
import SendIcon from '../components/icons/SendIcon';
import ImageIcon from '../components/icons/ImageIcon';
import CameraIcon from '../components/icons/CameraIcon';
import EmojiPicker from '../components/EmojiPicker';
// Import an icon for the 'New Chat' button (using a simple '+' or find/create one)
import PlusIcon from '../components/icons/PlusIcon'; // Make sure you have created PlusIcon.tsx

interface ChatPageProps {
    onUpgrade: () => void;
    token: string;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
}

// Helper function to generate a unique session ID
const generateSessionId = (phoneNumber: string | null): string => {
    const phonePart = phoneNumber ? phoneNumber.replace('+', '') : 'unknown'; // Use sanitized phone number
    return `${phonePart}_${Date.now()}`; // Combine with timestamp for uniqueness
};


const ChatPage: React.FC<ChatPageProps> = ({ onUpgrade, token }) => {
    const avatarSrc = "images/ssgirl1.png";
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // For AI response loading
    const [isHistoryLoading, setIsHistoryLoading] = useState(true); // For initial history loading
    const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [error, setError] = useState('');

    // --- State for current session ID ---
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    // ------------------------------------

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Fetch History Function (modified to accept sessionId) ---
    const fetchHistory = useCallback(async (sessionIdToFetch: string) => {
        if (!sessionIdToFetch) {
            console.warn("fetchHistory called without a sessionId");
            setIsHistoryLoading(false);
            setMessages([{ role: 'assistant', content: "Welcome! How can I assist you today?" }]);
            return;
        }
        console.log(`Fetching chat history for session: ${sessionIdToFetch}`);
        setIsHistoryLoading(true);
        setError('');
        setMessages([]); // Clear messages before loading history for the session
        try {
            const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080' || 'https://m99mpkns-8080.inc1.devtunnels.ms';
            // --- Pass sessionId as a query parameter ---
            const response = await fetch(`${apiBase}/api/chat/history?sessionId=${encodeURIComponent(sessionIdToFetch)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // ------------------------------------------

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to fetch history');
            }

            const history: Message[] = await response.json();
            if (history.length > 0) {
                 setMessages(history);
                 console.log(`Loaded ${history.length} messages for session ${sessionIdToFetch}.`);
            } else {
                 setMessages([{ role: 'assistant', content: "Welcome! How can I assist you today?" }]);
                 console.log(`No history found for session ${sessionIdToFetch}, setting initial welcome message.`);
            }

        } catch (err: any) {
            console.error("Error fetching history:", err);
            setError("Could not load messages for this session.");
            setMessages([{ role: 'assistant', content: "Sorry, couldn't load messages. How can I help now?" }]);
        } finally {
            setIsHistoryLoading(false);
        }
    }, [token]); // Re-fetch if token changes

    // --- useEffect for Initial Session ID and History Load ---
    useEffect(() => {
        const phoneNumber = localStorage.getItem('phoneNumber'); // Assumes stored like '+91...'
        const phonePart = phoneNumber ? phoneNumber.replace('+', '') : 'unknown';
        let activeSessionId = localStorage.getItem('activeChatSessionId');

        // --- VALIDATION LOGIC ---
        // If there's an active session, check if it belongs to the current user.
        // If not, it's a stale session from a previous login.
        if (activeSessionId && !activeSessionId.startsWith(phonePart)) {
            console.log(`Stale session detected (${activeSessionId}) for user ${phonePart}. Discarding.`);
            activeSessionId = null; // Discard the stale session ID
        }
        // -------------------------

        if (!activeSessionId) {
            activeSessionId = generateSessionId(phoneNumber);
            localStorage.setItem('activeChatSessionId', activeSessionId);
            console.log("No valid session found, created new:", activeSessionId);
        } else {
             console.log("Found valid active session:", activeSessionId);
        }

        setCurrentSessionId(activeSessionId); // Set the state
        fetchHistory(activeSessionId);      // Fetch history for this session

    }, [fetchHistory]); // Run only once on initial mount


    // --- Scrolling Effect (no change needed) ---
    useEffect(() => {
        const timer = setTimeout(() => {
             messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);


    // --- Form Submission (modified to send currentSessionId) ---
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() === '' || isLoading || isHistoryLoading || !currentSessionId) return; // Check currentSessionId too

        const userMessage: Message = { role: 'user', content: message };
        const currentMessages = [...messages, userMessage];

        setMessages(currentMessages);
        setMessage('');
        setShowEmojiPicker(false);
        setIsLoading(true);
        setError('');

        try {
            const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080';
            const response = await fetch(`${apiBase}/api/chat/chat`, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}`
                 },
                 body: JSON.stringify({
                     messages: currentMessages,
                     sessionId: currentSessionId // --- Send the current session ID ---
                 })
             });

            if (!response.ok) {
                 const errorData = await response.json();
                 if (response.status === 402) { throw new Error(errorData.error || "Payment required."); }
                 throw new Error(errorData.error || `Failed to get response`);
            }
            const aiResponse = await response.json();
            if (aiResponse && aiResponse.role === 'assistant') {
                setMessages(prev => [...prev, aiResponse]);
            } else { throw new Error('Invalid response format'); }

        } catch (error: any) {
            console.error('Error:', error);
            setError(error.message || 'An error occurred.');
            setMessages(prev => [...prev, { role: 'assistant', content: error.message || 'Error.', isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handle New Chat Button (modified) ---
    const handleNewChat = () => {
        console.log("Starting new chat session...");
        const phoneNumber = localStorage.getItem('phoneNumber');
        const newSessionId = generateSessionId(phoneNumber); // Create a unique ID

        localStorage.setItem('activeChatSessionId', newSessionId); // Store as the new active session
        setCurrentSessionId(newSessionId); // Update state

        // Reset messages to the initial welcome message for the new session
        setMessages([{ role: 'assistant', content: "Okay, let's start fresh. What's on your mind?" }]);
        setMessage(''); // Clear input
        setError(''); // Clear errors
        setIsHistoryLoading(false); // Ensure loading indicators are off
        setIsLoading(false);
    };
    // -----------------------------------

    // --- Other Handlers (isMobile, attachment, file/camera, emoji - no changes needed) ---
     const isMobile = () => /Mobi/i.test(navigator.userAgent);
     const handleAttachmentClick = () => { /* ... */ };
     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };
     const handleUploadClick = () => fileInputRef.current?.click();
     const handleTakePhotoClick = () => cameraInputRef.current?.click();
     const handleEmojiClick = (emoji: string) => setMessage(prev => prev + emoji);


    // JSX Part
    return (
        <div
            className="flex flex-col w-full bg-gray-50 font-sans fixed inset-0"
            style={{ height: '100%', overflow: 'hidden', touchAction: 'none', WebkitOverflowScrolling: 'touch' }}
        >
            {/* Header (Added handleNewChat to button) */}
            <header
                className="flex items-center justify-between p-3 border-b border-gray-200 bg-white"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: '72px', transform: 'translateY(0)', transformOrigin: 'top', willChange: 'transform' }}
            >
                {/* Left: Avatar & Status */}
                <div className="flex items-center space-x-3">
                     <img className="w-12 h-12 rounded-full object-cover" src={avatarSrc} alt="Sereine's avatar" />
                     <div>
                         <h2 className="text-lg font-semibold text-gray-800">Sereine</h2>
                         <div className="flex items-center space-x-1.5">
                             <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                             <p className="text-xs text-gray-500">Active Now</p>
                         </div>
                     </div>
                </div>
                {/* Right: New Chat & Upgrade */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleNewChat} // <-- Call the new chat handler
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        title="Start New Chat"
                        aria-label="Start New Chat"
                        disabled={isLoading || isHistoryLoading} // Disable while loading
                    >
                         <PlusIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={onUpgrade}
                        className="flex items-center space-x-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
                    >
                        <DiamondIcon className="w-4 h-4" />
                        <span>Upgrade</span>
                    </button>
                </div>
            </header>

            {/* Message Area (no layout changes needed) */}
            <main
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
                style={{ position: 'absolute', top: '72px', left: 0, right: 0, bottom: '80px', scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', overscrollBehavior: 'contain' }}
            >
                {/* Security Message */}
                <div className="flex flex-col items-center justify-center text-center text-gray-500 text-xs space-y-2 mb-4">
                    <LockIcon className="w-5 h-5 text-gray-400" />
                    <p>This chat is secure and confidential. All your messages are encrypted and never shared with others</p>
                </div>

                {/* Loading/Error States */}
                {isHistoryLoading && <div className="text-center text-gray-500 py-4">Loading messages...</div>}
                {!isHistoryLoading && error && <div className="text-center text-red-500 py-4">{error}</div>}

                {/* Display Messages */}
                {!isHistoryLoading && messages.map((msg, index) => (
                     <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                              msg.role === 'user'
                                 ? 'bg-blue-500 text-white rounded-br-none'
                                 : msg.isError
                                 ? 'bg-red-100 text-red-700 rounded-bl-none border border-red-200'
                                 : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                         }`}>
                             <p className="text-sm break-words">{msg.content}</p>
                         </div>
                     </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xs md:max-w-md lg:max-w-lg px-5 py-3 rounded-2xl bg-white text-gray-800 rounded-bl-none border border-gray-200">
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                                <span className="inline-block w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay:'120ms'}}></span>
                                <span className="inline-block w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay:'240ms'}}></span>
                            </div>
                        </div>
                    </div>
                )}
                {/* Scroll Anchor */}
                <div ref={messagesEndRef} />
            </main>

            {/* Footer Input Area (no changes needed here) */}
            <footer
                className="bg-white border-t"
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000, padding: '12px', height: '80px', boxSizing: 'border-box' }}
            >
                 {/* Attachment Options */}
                 {showAttachmentOptions && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={() => setShowAttachmentOptions(false)} aria-hidden="true"></div>
                        <div role="menu" className="absolute bottom-full right-4 mb-2 bg-white rounded-xl shadow-lg p-2 z-50 w-48 border border-gray-100">
                            <button role="menuitem" onClick={handleUploadClick} className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"><ImageIcon className="w-5 h-5" /><span>Upload Picture</span></button>
                            <button role="menuitem" onClick={handleTakePhotoClick} className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"><CameraIcon className="w-5 h-5" /><span>Take Photo</span></button>
                        </div>
                    </>
                )}
                 {/* Emoji Picker */}
                 {showEmojiPicker && <EmojiPicker onEmojiSelect={handleEmojiClick} onClose={() => setShowEmojiPicker(false)} />}
                {/* Input Form */}
                <form onSubmit={handleFormSubmit} className="flex items-center bg-gray-100 rounded-full p-2">
                     <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)} className="p-2 text-gray-500 hover:text-gray-700" aria-label="Add emoji"><EmojiIcon className="w-6 h-6" /></button>
                     <input type="text" placeholder="Type your Message..." className="flex-1 bg-transparent border-none outline-none px-2 text-gray-800 placeholder-gray-500 min-w-0" aria-label="Message input" value={message} onChange={(e) => setMessage(e.target.value)} onFocus={() => { setShowEmojiPicker(false); setShowAttachmentOptions(false); }} />
                     <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-hidden="true" />
                     <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" aria-hidden="true" />
                     <button type="button" onClick={handleAttachmentClick} className="p-2 text-gray-500 hover:text-gray-700" aria-label="Attach file" aria-haspopup="true" aria-expanded={showAttachmentOptions}><PaperclipIcon className="w-6 h-6" /></button>
                     <button type="submit" disabled={isLoading || isHistoryLoading} className={`ml-2 text-white rounded-full p-3 transition-colors shadow-lg ${isLoading || isHistoryLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30'}`} aria-label="Send message"><SendIcon className="w-5 h-5" /></button>
                 </form>
            </footer>
        </div>
    );
};


export default ChatPage;