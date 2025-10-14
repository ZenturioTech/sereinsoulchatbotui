import React, { useState, useRef, useEffect } from 'react';
import DiamondIcon from '../components/icons/DiamondIcon';
import LockIcon from '../components/icons/LockIcon';
import EmojiIcon from '../components/icons/EmojiIcon';
import PaperclipIcon from '../components/icons/PaperclipIcon';
import SendIcon from '../components/icons/SendIcon';
import ImageIcon from '../components/icons/ImageIcon';
import CameraIcon from '../components/icons/CameraIcon';
import EmojiPicker from '../components/EmojiPicker';


interface ChatPageProps {
    onUpgrade: () => void;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ onUpgrade }) => {
    // Base64 encoded placeholder for the avatar image to avoid external dependencies.
    const avatarSrc = "images/ssgirl1.png"
    const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTypingIntro, setShowTypingIntro] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    
    useEffect(() => {
        // Show typing first, then display the intro message
        const init = async () => {
            setShowTypingIntro(true);
            try {
                const phoneNumber = localStorage.getItem('phoneNumber');
                const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
                const res = await fetch(`${apiBase}/api/chat/chat/intro`, {
                    method: 'GET',
                    headers: {
                        'phone-number': phoneNumber || ''
                    }
                });
                const intro = res.ok ? await res.json() : { role: 'assistant', content: "I'm here with you. How are you feeling today?" };
                // small delay to let typing show first
                setTimeout(() => {
                    if (intro && (intro.role === 'assistant' || intro.role === 'system')) {
                        setMessages([intro]);
                    } else {
                        setMessages([{ role: 'assistant', content: "I'm here with you. How are you feeling today?" }]);
                    }
                    setShowTypingIntro(false);
                }, 900);
            } catch {
                setTimeout(() => {
                    setMessages([{ role: 'assistant', content: "I'm here with you. How are you feeling today?" }]);
                    setShowTypingIntro(false);
                }, 900);
            } finally {
                localStorage.removeItem('chatMessages');
                localStorage.removeItem('chatLastAt');
            }
        };
        init();
    }, []);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Intro typing is controlled by the intro fetch effect; no standalone timer here

    useEffect(() => {
        const handleResize = () => {
            if (window.visualViewport) {
                const viewport = window.visualViewport;
                setViewportHeight(viewport.height);
                
                // Update header position when keyboard shows/hides
                const header = document.querySelector('header');
                const main = document.querySelector('main');
                const footer = document.querySelector('footer');
                
                if (header && main && footer) {
                    const offsetTop = viewport.offsetTop;
                    const scale = viewport.scale;
                    
                    header.style.transform = `translateY(${offsetTop}px) scale(${scale})`;
                    header.style.position = 'fixed';
                    
                    main.style.top = `${offsetTop + 72}px`; // 72px is header height
                    main.style.bottom = '80px'; // footer height
                    main.style.position = 'fixed';
                    
                    footer.style.position = 'fixed';
                    footer.style.bottom = '0';
                }
            } else {
                setViewportHeight(window.innerHeight);
            }
        };

        // Prevent zoom on input focus
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }

        // Listen to viewport changes
        window.addEventListener('resize', handleResize);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
            window.visualViewport.addEventListener('scroll', handleResize);
        }

        // Set initial height
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
                window.visualViewport.removeEventListener('scroll', handleResize);
            }
        };
    }, []);


    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() === '' || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: message
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);
        setMessage('');
        setShowEmojiPicker(false);
        setIsLoading(true);

        try {
            const phoneNumber = localStorage.getItem('phoneNumber');
            if (!phoneNumber) {
                throw new Error('No phone number found. Please sign in again.');
            }
            const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';
            const response = await fetch(`${apiBase}/api/chat/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'phone-number': phoneNumber
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    model: 'sereinsoul'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to get response from AI: ${await response.text()}`);
            }

            const aiResponse = await response.json();
            if (aiResponse && (aiResponse.role === 'assistant' || aiResponse.role === 'system')) {
                setMessages(prevMessages => [...prevMessages, aiResponse]);
            } else {
                console.error('Invalid response format:', aiResponse);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error:', error);
            // Add error message to chat
            setMessages(prevMessages => [...prevMessages, {
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    }

    // Persist messages and update last activity timestamp
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            localStorage.setItem('chatLastAt', String(Date.now()));
        }
    }, [messages]);
    
    const isMobile = () => {
        return /Mobi/i.test(navigator.userAgent);
    };

    const handleAttachmentClick = () => {
        if (isMobile()) {
            setShowAttachmentOptions(prev => !prev);
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            alert(`File selected: ${file.name}`);
            console.log('File selected:', file);
        }
        setShowAttachmentOptions(false);
        if(event.target) {
            event.target.value = '';
        }
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleTakePhotoClick = () => {
        cameraInputRef.current?.click();
    };

    const handleEmojiClick = (emoji: string) => {
        setMessage(prevMessage => prevMessage + emoji);
    };

    return (
        <div 
            className="flex flex-col w-full bg-gray-50 font-sans fixed inset-0" 
            style={{ 
                height: '100%',
                overflow: 'hidden',
                touchAction: 'none',
                WebkitOverflowScrolling: 'touch'
            }}
        >
            {/* Chat Header - Fixed at top like WhatsApp */}
            <header 
                className="flex items-center justify-between p-3 border-b border-gray-200 bg-white"
                style={{ 
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    height: '72px',
                    transform: 'translateY(0)',
                    transformOrigin: 'top',
                    willChange: 'transform'
                }}
            >
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
                <button 
                    onClick={onUpgrade}
                    className="flex items-center space-x-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
                >
                    <DiamondIcon className="w-4 h-4" />
                    <span>Upgrade now</span>
                </button>
            </header>

            {/* Message Area - Only this scrolls, positioned between fixed header and footer */}
            <main 
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4" 
                style={{ 
                    position: 'absolute',
                    top: '72px',
                    left: 0,
                    right: 0,
                    bottom: '80px',
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-y',
                    overscrollBehavior: 'contain'
                }}
            >
                <div className="flex flex-col items-center justify-center text-center text-gray-500 text-xs space-y-2 mb-4">
                    <LockIcon className="w-5 h-5 text-gray-400" />
                    <p>This chat is secure and confidential. All your messages are encrypted and never shared with others</p>
                </div>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}`}>
                            <p className="text-sm break-words">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {(showTypingIntro || isLoading) && (
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
                <div ref={messagesEndRef} />
            </main>

            {/* Message Input - Fixed at bottom, no gap with keyboard */}
            <footer 
                className="bg-white border-t"
                style={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    padding: '12px',
                    height: '80px',
                    boxSizing: 'border-box'
                }}
            >
                 {showAttachmentOptions && (
                    <>
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-25 z-40"
                            onClick={() => setShowAttachmentOptions(false)}
                            aria-hidden="true"
                        ></div>
                        <div role="menu" className="absolute bottom-full right-4 mb-2 bg-white rounded-xl shadow-lg p-2 z-50 w-48 border border-gray-100">
                            <button role="menuitem" onClick={handleUploadClick} className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                                <ImageIcon className="w-5 h-5" />
                                <span>Upload Picture</span>
                            </button>
                            <button role="menuitem" onClick={handleTakePhotoClick} className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors">
                                <CameraIcon className="w-5 h-5" />
                                <span>Take Photo</span>
                            </button>
                        </div>
                    </>
                )}
                 {showEmojiPicker && (
                    <EmojiPicker
                        onEmojiSelect={handleEmojiClick}
                        onClose={() => setShowEmojiPicker(false)}
                    />
                )}
                <form onSubmit={handleFormSubmit} className="flex items-center bg-gray-100 rounded-full p-2">
                    <button 
                        type="button" 
                        onClick={() => setShowEmojiPicker(prev => !prev)} 
                        className="p-2 text-gray-500 hover:text-gray-700" 
                        aria-label="Add emoji"
                    >
                        <EmojiIcon className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        placeholder="Type your Message..."
                        className="flex-1 bg-transparent border-none outline-none px-2 text-gray-800 placeholder-gray-500 min-w-0"
                        aria-label="Message input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => {
                           setShowEmojiPicker(false);
                           setShowAttachmentOptions(false);
                        }}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-hidden="true"
                    />
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-hidden="true"
                    />
                    <button 
                        type="button" 
                        onClick={handleAttachmentClick} 
                        className="p-2 text-gray-500 hover:text-gray-700" 
                        aria-label="Attach file"
                        aria-haspopup="true"
                        aria-expanded={showAttachmentOptions}
                    >
                        <PaperclipIcon className="w-6 h-6" />
                    </button>
                    <button type="submit" className="ml-2 bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30" aria-label="Send message">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatPage;