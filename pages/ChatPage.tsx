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
import PlusIcon from '../components/icons/PlusIcon'; // Make sure this import is correct

interface ChatPageProps {
    onUpgrade: () => void;
    token: string;
    onBackToHome: () => void;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
}
const GATEKEEPER_API_KEY = (import.meta as any).env.VITE_GATEKEEPER_API_KEY;

// Helper function to generate a unique session ID
const generateSessionId = (phoneNumber: string | null): string => {
    const phonePart = phoneNumber ? phoneNumber.replace('+', '') : 'unknown'; // Use sanitized phone number
    return `${phonePart}_${Date.now()}`; // Combine with timestamp for uniqueness
};


const ChatPage: React.FC<ChatPageProps> = ({ onUpgrade, token, onBackToHome }) => {
    const avatarSrc = "images/ssgirl1.png";
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // For AI response loading
    const [isHistoryLoading, setIsHistoryLoading] = useState(true); // For initial history loading
    const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [error, setError] = useState('');
    const [expandedMessageIndex, setExpandedMessageIndex] = useState<number | null>(null);
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const [isInitialCheck, setIsInitialCheck] = useState<boolean>(true); // Track initial check
    const [showNewChatConfirm, setShowNewChatConfirm] = useState(false);


    // --- State for current session ID ---
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    // ------------------------------------

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputFieldRef = useRef<HTMLInputElement>(null);

    // --- Fetch History Function (modified to accept sessionId) ---
    const fetchHistory = useCallback(async (sessionIdToFetch: string) => {
        if (!sessionIdToFetch) {
            console.warn("fetchHistory called without a sessionId");
            setIsHistoryLoading(false);
            // No longer set welcome message here
            setMessages([]);
            return;
        }
        console.log(`Fetching chat history for session: ${sessionIdToFetch}`);
        setIsHistoryLoading(true);
        setError('');
        setMessages([]); // Clear messages before loading history for the session
        try {
            const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080';
            // --- Pass sessionId as a query parameter ---
            const response = await fetch(`${apiBase}/api/chat/history?sessionId=${encodeURIComponent(sessionIdToFetch)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            // ------------------------------------------

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to fetch history');
            }

            const history: Message[] = await response.json();
            
            // --- MODIFICATION ---
            // Simply set the history, even if it's an empty array.
            // The hardcoded welcome message will be handled by the JSX.
            setMessages(history);
            if (history.length > 0) {
                 console.log(`Loaded ${history.length} messages for session ${sessionIdToFetch}.`);
            } else {
                 // This is now the expected behavior for a new chat
                 console.log(`No history found for session ${sessionIdToFetch}. Displaying static greeting.`);
            }
            // --- END MODIFICATION ---

        } catch (err: any) {
            console.error("Error fetching history:", err);
            setError("Could not load messages for this session.");
            // No longer set welcome message here, just let the error show
            setMessages([]);
        } finally {
            setIsHistoryLoading(false);
        }
    }, [token]); // Re-fetch if token changes

    useEffect(() => {
        const apiBase = (import.meta as any).env.VITE_API_BASE_URL;
        console.log("🔍 Health check URL:", `${apiBase}/health`);

        const checkOnline = async () => {
            try {
            const res = await fetch(`${apiBase}/health`, {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' },
            });

            console.log("🟢 Health response:", res.status, res.ok);
            setIsOnline(res.ok);
            } catch (err) {
            console.error("🔴 Health check failed:", err);
            setIsOnline(false);
            }
        };

        // Initial check
        checkOnline().then(() => {
            setIsInitialCheck(false); // Mark initial check as complete
        });
        
        // Set up interval after initial check
        const interval = setInterval(checkOnline, 10000);
        return () => clearInterval(interval);
    }, []);



    // --- useEffect for Initial Session ID and History Load ---
    useEffect(() => {
        if (isInitialCheck) return; // Don't run until initial check is complete
        
        const phoneNumber = localStorage.getItem('phoneNumber'); // Assumes stored like '+91...'
        const phonePart = phoneNumber ? phoneNumber.replace('+', '') : 'unknown';
        let activeSessionId = localStorage.getItem('activeChatSessionId');

        // --- VALIDATION LOGIC ---
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
        
        // Only fetch history if online, otherwise show offline message
        if (isOnline) {
            fetchHistory(activeSessionId);      // Fetch history for this session
        } else {
            setIsHistoryLoading(false);
            setMessages([]);
        }

    }, [fetchHistory, isOnline, isInitialCheck]); // Run when initial check is complete


    // --- Scrolling Effect (no change needed) ---
    useEffect(() => {
        const timer = setTimeout(() => {
             messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);


    // --- Form Submission (modified for animation) ---
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() === '' || isLoading || isHistoryLoading || !currentSessionId) return;

        // Prevent sending messages if offline
        if (!isOnline) {
            // --- MODIFICATION ---
            // Set an error message in the 'messages' state
            setError("I'm sleeping, come back later -Your Seri");
            // Do not clear existing messages
            // setMessages([{ role: 'assistant', content: "I'm sleeping, come back later -Your Seri" }]);
            return;
        }

        const userMessage: Message = { role: 'user', content: message };
        // --- MODIFICATION ---
        // The `messages` state *only* contains real history.
        // This is correct. The static welcome message is not in the state.
        const currentMessages = [...messages, userMessage];
        // --- END MODIFICATION ---

        // Update UI immediately
        setMessages(currentMessages);
        // Optional: comment this if you want to keep the text visible
        setMessage('');
        setShowEmojiPicker(false);
        setIsLoading(true);
        setError('');

        // ✅ Keep keyboard open
        inputFieldRef.current?.focus();

        try {
            const apiBase = (import.meta as any).env.VITE_API_BASE_URL;
            const response = await fetch(`${apiBase}/api/chat/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'x-api-key': GATEKEEPER_API_KEY
                },
                body: JSON.stringify({
                    messages: currentMessages, // This correctly sends *only* actual history
                    sessionId: currentSessionId
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
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error: any) {
            console.error('Error:', error);
            setError(error.message || 'An error occurred.');
            setMessages(prev => [...prev, { role: 'assistant', content: error.message || 'Error.', isError: true }]);
        } finally {
            setIsLoading(false);
            // ✅ Keep keyboard open for next message
            inputFieldRef.current?.focus();
        }
    };
    const handleNewChat = () => {
        setShowNewChatConfirm(true);
    };


    // --- Handle New Chat Button (modified to call fetchHistory) ---
    // const handleNewChat = async () => {
    //     const userConfirmed = window.confirm(
    //     "Starting a new chat will clear your current conversation history. Are you sure you want to proceed?"
    //     );
    //     if (!userConfirmed) {
    //         return; // Stop if the user cancels
    //     }
    //     console.log("Starting new chat session...");
    //     const phoneNumber = localStorage.getItem('phoneNumber');
    //     const newSessionId = generateSessionId(phoneNumber);

    //     localStorage.setItem('activeChatSessionId', newSessionId);
    //     setCurrentSessionId(newSessionId);
        
    //     setIsHistoryLoading(true); // Show loading spinner
    //     setMessages([]); // Clear messages immediately
    //     setMessage('');
    //     setError('');
    //     setExpandedMessageIndex(null); // Reset expanded message

    //     // If offline, show offline message and return
    //     if (!isOnline) {
    //         setIsHistoryLoading(false);
    //         setMessages([{ role: 'assistant', content: "I'm sleeping, come back later -Your Seri" }]);
    //         return;
    //     }

    //     try {
    //         // Fetch history for the *new* session (which will return the initial greeting from backend)
    //         await fetchHistory(newSessionId); // This will set messages and stop loading

    //     } catch (err) {
    //         console.error("Failed to start new chat:", err);
    //         setError("Could not start a new chat session.");
    //         setMessages([{ role: 'assistant', content: "Okay, let's start fresh. What's on your mind?" }]); // Fallback greeting
    //         setIsHistoryLoading(false); // Stop loading on error
    //     }
    // };
    // // -----------------------------------


    const confirmNewChat = async () => {
        setShowNewChatConfirm(false); // Close modal
        console.log("Starting new chat session after confirmation...");
        // --- Existing new chat logic ---
        const phoneNumber = localStorage.getItem('phoneNumber');
        const newSessionId = generateSessionId(phoneNumber);

        localStorage.setItem('activeChatSessionId', newSessionId);
        setCurrentSessionId(newSessionId);

        setIsHistoryLoading(true);
        setMessages([]);
        setMessage('');
        setError('');
        setExpandedMessageIndex(null);

        if (!isOnline) {
            setIsHistoryLoading(false);
            // setMessages([]); // No need to set offline message, static greeting will show
            return;
        }

        try {
            // This will now fetch an empty history []
            await fetchHistory(newSessionId);
        } catch (err) {
            console.error("Failed to start new chat:", err);
            setError("Could not start a new chat session.");
            setMessages([]); // Set to empty on error
            setIsHistoryLoading(false);
        }
        // --- End existing logic ---
    };

    // --- Function to cancel creating a new chat ---
    const cancelNewChat = () => {
        setShowNewChatConfirm(false); // Close modal
    };

    // --- Other Handlers (no changes) ---
     const isMobile = () => /Mobi/i.test(navigator.userAgent);
     const handleAttachmentClick = () => {
        setShowAttachmentOptions(prev => !prev); // Toggle the state
        setShowEmojiPicker(false); // Close emoji picker if open
     };
     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("File selected:", file.name);
            // TODO: Implement file upload logic here
            // e.g., display preview, upload to server
            setMessages(prev => [...prev, { role: 'user', content: `(Sent image: ${file.name})` }]); // Placeholder
        }
        setShowAttachmentOptions(false); 
        event.target.value = '';
     };
     const handleUploadClick = () => fileInputRef.current?.click();
     const handleTakePhotoClick = () => cameraInputRef.current?.click();
     const handleEmojiClick = (emoji: string) => setMessage(prev => prev + emoji);

     // ====================================================================
     // --- RENDER FIX: This function is modified to parse '*' correctly ---
     // ====================================================================
     const formatMessageContent = (content: string) => {
        
        // --- MODIFIED: More flexible regex to test for phone numbers ---
        const phonePattern = /([\d-]{10,})/g; // Looser test for any long digit/dash string
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        // -----------------------------------------------------------

        const hasPhones = phonePattern.test(content);
        const hasUrls = urlPattern.test(content);

        if (hasPhones || hasUrls) {
            const lines = content.split('\n');
            const elements: React.ReactElement[] = [];
            
            lines.forEach((line, idx) => {

                // --- MODIFIED: Regex handles optional leading '*', whitespace, and varied phone formats ---
                const phoneMatch = line.match(/^\s*\*?\s*([^:]+?):\s*([\d\s-]+)$/);
                
                // --- MODIFIED: Regex handles optional leading '*' and whitespace ---
                const urlMatch = line.match(/^\s*\*?\s*([^:]+?):\s*(https?:\/\/[^\s]+)$/);

                if (phoneMatch) {
                    // Use map(trim) to clean up capture groups
                    const [, name, phone] = phoneMatch.map(s => s ? s.trim() : '');
                    elements.push(
                        <div key={`phone-${idx}`} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mb-2 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex-1">
                                <div className="text-xs font-semibold text-green-800 mb-0.5">{name}</div>
                                <div className="text-sm font-mono text-green-900">{phone}</div>
                            </div>
                            <a
                                href={`tel:${phone.replace(/[-\s]/g, '')}`} // Clean phone for tel link
                                onClick={(e) => e.stopPropagation()}
                                className="ml-3 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-md"
                                aria-label={`Call ${name}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </a>
                        </div>
                    );
                }
                // Check for URLs
                else if (urlMatch) {
                     // Use map(trim) to clean up capture groups
                    const [, label, url] = urlMatch.map(s => s ? s.trim() : '');
                    elements.push(
                        <a
                            key={`url-${idx}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="block bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mb-2 hover:shadow-md transition-all duration-200 hover:border-blue-300 group"
                        >
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-blue-800 mb-0.5">{label}</div>
                                    <div className="text-xs text-blue-600 truncate group-hover:text-blue-700">{url}</div>
                                </div>
                            </div>
                        </a>
                    );
                }
                // --- MODIFIED: Render any other non-empty line ---
                else if (line.trim()) {
                    elements.push(
                        <p key={`text-${idx}`} className="text-[15px] mb-1">{line}</p>
                    );
                }
                // Empty lines are automatically skipped
            });
            
            return <div className="space-y-1">{elements}</div>;
        }

        // Fallback for simple messages
        return <p className="text-[15px] break-words">{content}</p>;
    };
    // ====================================================================
    // --- END OF RENDER FIX ---
    // ====================================================================


    const handleMessageClick = (index: number) => {
        setExpandedMessageIndex(expandedMessageIndex === index ? null : index);
    };

    const handleBackgroundClick = (e: React.MouseEvent) => {
        // Only close if clicking on the main background, not on any child elements
        if (e.target === e.currentTarget && expandedMessageIndex !== null) {
            setExpandedMessageIndex(null);
        }
    };


    // JSX Part
    return (
        <div
            className="flex flex-col w-full bg-gray-50 font-sans fixed inset-0"
            style={{ overflow: 'hidden',
                fontFamily: "'Poppins', sans-serif"
             }}
        >
            {/* Header (no changes) */}
            <header
                className="flex items-center justify-between p-3 border-b border-gray-200 bg-white"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: '72px' }}
            >
                {/* ... (header content) ... */}
                 <div className="flex items-center"> {/* Reduced space */}
                    {/* Back Button */}
                    <button
                        onClick={onBackToHome} // <-- CALL PROP ON CLICK
                        className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        title="Back to Home"
                        aria-label="Back to Home"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                     <img className="w-12 h-12 rounded-full object-cover" src={avatarSrc} alt="Sereine's avatar" />
                     <div>
                         <h2 className="text-lg  text-gray-800">Seri</h2>
                         <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className="text-sm text-gray-700">
                                {isOnline ? 'Active now' : 'Offline'}
                            </span>
                        </div>

                     </div>
                 </div>
                 <div className="flex items-center space-x-3">
                     <button
                         onClick={handleNewChat}
                         className="p text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                         title="Start New Chat"
                         aria-label="Start New Chat"
                         disabled={isLoading || isHistoryLoading}
                     >
                          <PlusIcon className="w-6 h-6" />
                     </button>
                     <button
                         onClick={onUpgrade}
                         className="flex items-center space-x-2 bg-blue-600 text-white font-bold px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
                     >
                         <DiamondIcon className="w-4 h-4" />
                         <span>Upgrade</span>
                     </button>
                 </div>
            </header>

            {/* Message Area */}
            <main
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
                style={{ position: 'absolute', top: '72px', left: 0, right: 0, bottom: '80px', scrollBehavior: 'smooth', touchAction: 'pan-y', overscrollBehavior: 'contain' }}
                onClick={handleBackgroundClick}
            >
                {/* ... (Security Message, Loading/Error States) ... */}
                 <div className="flex flex-col items-center justify-center text-center text-gray-500 text-xs space-y-2 mb-4 font-light">
                     <LockIcon className="w-5 h-5 text-gray-400" />
                     <p>This chat is secure and confidential. All your messages are encrypted and never shared with others</p>
                 </div>
                 
                 {/* Show offline message when offline */}
                 {!isOnline && !isInitialCheck && (
                     <div className="flex flex-col items-center justify-center h-full text-center">
                         <p className="text-gray-700 text-lg">I'm sleeping, come back later</p>
                         <p className="text-gray-500 mt-2">-Your Seri</p>
                         {/* Typing indicator animation */}
                         <div className="flex items-center gap-1.5 mt-4">
                             <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                             <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'120ms'}}></span>
                             <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'240ms'}}></span>
                         </div>
                     </div>
                 )}
                 
                 {isInitialCheck && (
                     <div className="text-center text-gray-500 py-4">Checking status...</div>
                 )}
                 
                 {isHistoryLoading && isOnline && <div className="text-center text-gray-500 py-4">Loading messages...</div>}
                 {!isHistoryLoading && error && <div className="text-center text-red-500 py-4">{error}</div>}

                {/* --- MODIFICATION: Display Messages --- */}
                {!isHistoryLoading && !isInitialCheck && isOnline && (
                    <>
                        {/* 1. Hardcoded Welcome Message (Always shows) */}
                        <div 
                            className="flex justify-start"
                            style={{
                                animation: 'slideInLeft 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                                opacity: 0,
                                animationDelay: '0s' // Show immediately
                            }}
                        >
                            <div 
                                className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-white text-gray-800 rounded-bl-none border border-gray-300 shadow-md"
                            >
                                <p className="text-[15px] break-words">Hi there! I'm Seri. Just want you to know I'm here for you. Feel free to share whatever's on your mind.</p>
                            </div>
                        </div>

                        {/* 2. Mapped History Messages (From state) */}
                        {messages.map((msg, index) => {
                            const isLastUserMessage = msg.role === 'user' && index === messages.length - 1;
                            const isExpanded = expandedMessageIndex === index;
                            
                            return (
                                <div 
                                    key={`${currentSessionId}-${msg.role}-${index}-${msg.content.slice(0, 10)}`}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative transition-all duration-300`}
                                    style={{
                                        animation: `${msg.role === 'user' ? 'popInFromInput' : 'slideInLeft'} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
                                        opacity: 0,
                                        // Adjust animation delay to account for the static message
                                        animationDelay: isLastUserMessage ? '0s' : `${Math.min((index + 1) * 0.05, 0.3)}s`,
                                        zIndex: isExpanded ? 1000 : 1,
                                        filter: expandedMessageIndex !== null && !isExpanded ? 'blur(4px)' : 'none',
                                        pointerEvents: expandedMessageIndex !== null && !isExpanded ? 'none' : 'auto'
                                    }}
                                >
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMessageClick(index);
                                        }}
                                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                                             msg.role === 'user'
                                                ? 'bg-blue-500 text-white rounded-br-none shadow-md hover:shadow-lg'
                                                : msg.isError
                                                ? 'bg-red-100 text-red-700 rounded-bl-none border border-red-200 shadow-md hover:shadow-lg'
                                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-300 shadow-md hover:shadow-lg'
                                        }`}
                                        style={{
                                            transform: isExpanded ? 'scale(1.15)' : 'scale(1)',
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            boxShadow: isExpanded 
                                                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15)'
                                                : undefined
                                        }}
                                    >
                                        {formatMessageContent(msg.content)}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
                {/* --- END MODIFICATION --- */}


                {/* Typing Indicator with smooth animation */}
                {isLoading && (
                    <div 
                        className="flex justify-start"
                        style={{
                            animation: 'slideInLeft 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                            opacity: 0
                        }}
                    >
                        <div className="max-w-xs md:max-w-md lg:max-w-lg px-5 py-3 rounded-2xl bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-md">
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'120ms'}}></span>
                                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'240ms'}}></span>
                            </div>
                        </div>
                    </div>
                )}
                {/* Scroll Anchor */}
                <div ref={messagesEndRef} />
            </main>

            {/* Footer Input Area (no changes) */}
            <footer
                className="bg-white border-t"
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000, padding: '12px', height: '80px', boxSizing: 'border-box' }}
            >
                 {showAttachmentOptions && (
                    <>
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-200" 
                            onClick={() => setShowAttachmentOptions(false)} 
                            aria-hidden="true" 
                            style={{ 
                                zIndex: 1010,
                                animation: 'fadeIn 0.2s ease-out forwards'
                            }}
                        ></div>
                        <div 
                            role="menu" 
                            className="absolute bottom-full right-4 mb-2 bg-white rounded-xl shadow-lg p-2 w-48 border border-gray-100" 
                            style={{ 
                                zIndex: 1020,
                                animation: 'slideUpFade 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                                transformOrigin: 'bottom right'
                            }}
                        >
                            <button role="menuitem" onClick={handleUploadClick} className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"><ImageIcon className="w-5 h-5" /><span>Upload Picture</span></button>
                            <button role="menuitem" onClick={handleTakePhotoClick} className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"><CameraIcon className="w-5 h-5" /><span>Take Photo</span></button>
                        </div>
                    </>
                 )}
                 {showEmojiPicker && (
                    <div style={{ animation: 'slideUpFade 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
                        <EmojiPicker onEmojiSelect={handleEmojiClick} onClose={() => setShowEmojiPicker(false)} style={{ zIndex: 1020 }} />
                    </div>
                 )}
                {/* Input Form */}
                <form onSubmit={handleFormSubmit} className="flex items-center bg-gray-100 rounded-full p-2 relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
                     <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)} className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200" aria-label="Add emoji"><EmojiIcon className="w-6 h-6" /></button>
                     <input 
                         ref={inputFieldRef}
                         type="text" 
                         placeholder="Type your Message..." 
                         className="flex-1 bg-transparent border-none outline-none px-2 text-gray-800 placeholder-gray-500 min-w-0 text-base"
                         aria-label="Message input" 
                         value={message} 
                         onChange={(e) => setMessage(e.target.value)} 
                         onFocus={() => { setShowEmojiPicker(false); setShowAttachmentOptions(false); }} 
                         autoComplete="off"
                         autoCorrect="off"
                         spellCheck="false"
                     />
                     <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-hidden="true" />
                     <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" aria-hidden="true" />
                     <button type="button" onClick={handleAttachmentClick} className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200" aria-label="Attach file" aria-haspopup="true" aria-expanded={showAttachmentOptions}><PaperclipIcon className="w-6 h-6" /></button>
                     <button 
                         type="submit" 
                         disabled={isLoading || isHistoryLoading || !isOnline} 
                         className={`ml-2 text-white rounded-full p-3 transition-all duration-300 shadow-lg transform active:scale-95 ${
                             isLoading || isHistoryLoading || !isOnline 
                                 ? 'bg-gray-400 cursor-not-allowed' 
                                 : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30 hover:scale-105'
                         }`} 
                         aria-label="Send message"
                     >
                         <SendIcon className="w-5 h-5" />
                     </button>
                 </form>
            </footer>

            {showNewChatConfirm && (
                <div
                    className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ease-out"
                    // Add fade-in animation for overlay
                    style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
                    onClick={cancelNewChat} // Close if clicking overlay
                >
                    <div
                        className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm transition-all duration-300 ease-out transform scale-95 opacity-0"
                        // Add scale/fade-in animation for modal box
                        style={{ animation: 'scaleUpFade 0.3s ease-out 0.1s forwards' }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">Start New Chat?</h3>
                        <p className="text-md text-gray-600 mb-4 text-centre">
                            Starting a new chat will clear your current conversation history. Are you sure you want to proceed?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelNewChat}
                                className="px-4 py-2 rounded-full text-md font-medium text-gray-800 bg-gray-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmNewChat}
                                className="px-4 py-2 rounded-full text-md font-medium text-white bg-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                OK, proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- End New Chat Modal --- */}

            {/* --- MODIFIED STYLE BLOCK to include modal animations --- */}
            <style>{`
                /* ... (Existing keyframes: popInFromInput, slideInLeft) ... */
                @keyframes popInFromInput {
                    0% { opacity: 0; transform: translateY(60px) translateX(-20px) scale(0.3); }
                    60% { opacity: 1; transform: translateY(-5px) translateX(0) scale(1.05); }
                    100% { opacity: 1; transform: translateY(0) translateX(0) scale(1); }
                }
                @keyframes slideInLeft {
                    0% { opacity: 0; transform: translateX(-30px) scale(0.9); }
                    60% { opacity: 1; transform: translateX(2px) scale(1.02); }
                    100% { opacity: 1; transform: translateX(0) scale(1); }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleUpFade {
                     from {
                        opacity: 0;
                        transform: scale(0.95);
                     }
                     to {
                        opacity: 1;
                        transform: scale(1);
                     }
                }

                @keyframes slideUpFade { /* For Emoji/Attachment popups */
                    0% { opacity: 0; transform: translateY(10px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }

                main { scroll-behavior: smooth; }

                /* ... (Existing styles for hover, backdrop, etc.) ... */
                 .max-w-xs:hover, .max-w-md:hover, .max-w-lg:hover {
                    transform: scale(1.02) !important;
                }
                 button, a, input {
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                 .backdrop-blur {
                    backdrop-filter: blur(3px);
                    transition: backdrop-filter 0.3s ease;
                }
            `}</style>
            {/* --------------------------- */}

        </div>
    );
};

export default ChatPage;