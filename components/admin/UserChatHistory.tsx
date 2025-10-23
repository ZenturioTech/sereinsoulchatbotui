import React, { useState, useEffect, useRef } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    isError?: boolean;
}

interface UserChatHistoryProps {
    token: string;
    sessionId: string;
}
const GATEKEEPER_API_KEY = import.meta.env.VITE_GATEKEEPER_API_KEY;

const UserChatHistory: React.FC<UserChatHistoryProps> = ({ token, sessionId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!sessionId) return;
            setIsLoading(true);
            setError('');
            setMessages([]); // Clear previous messages
            try {
                const apiBase = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080';
                const response = await fetch(`${apiBase}/api/admin/messages/${encodeURIComponent(sessionId)}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'x-api-key': GATEKEEPER_API_KEY
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data: Message[] = await response.json();
                setMessages(data);
            } catch (err: any) {
                setError(err.message || 'Error loading messages');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessages();
    }, [token, sessionId]); // Refetch when sessionId changes

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Chat History for {sessionId}</h3>
            {isLoading && <p>Loading messages...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && messages.length === 0 && <p className="text-gray-500">No messages found for this user.</p>}
            {!isLoading && messages.length > 0 && (
                <div className="space-y-3 pr-2 max-h-[calc(100vh-200px)] overflow-y-auto"> {/* Adjust max-h as needed */}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl px-4 py-2 rounded-lg ${
                                msg.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : msg.isError
                                    ? 'bg-red-100 text-red-700 border border-red-200'
                                    : 'bg-white text-gray-800 border'
                            }`}>
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                     <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};

export default UserChatHistory;