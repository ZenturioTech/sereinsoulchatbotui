import React, { useState, useEffect } from 'react';
import SereinSoulLogo from '../components/icons/SereinSoulLogo';

interface SubscriptionPageProps {
  onBackToChat: () => void;
}

// Define Plan structure without paymentUrl initially
interface Plan {
    title: string;
    validity: string;
    features: string[];
    // paymentUrl?: string; // Make optional or remove if fetched separately
    key: 'day' | 'week' | 'month'; // Add a key to identify the plan
}

const initialPlans: Plan[] = [
    {
        key: 'day',
        title: 'Day Pass',
        validity: '24hrs',
        features: [
            'Unlimited chat with AI wellness buddy',
            'Access to guided meditations & relaxation audio',
            'Mood tracking & journaling for 1 day',
            'Quick stress-relief exercises',
        ],
    },
    {
        key: 'week', // Add key
        title: 'Week Pass',
        validity: '7 Days',
        features: [
            'Unlimited chat with AI wellness buddy',
            'Daily personalized affirmations',
            '7-day mental fitness challenge (breathing, journaling, mindfulness tasks)',
            'Access to curated content (WHO & NHS-based self-care guides)',
            'Progress summary at the end of the week',
        ],
    },
    {
        key: 'month', // Add key
        title: 'Month Pass',
        validity: '30 Days',
        features: [
            'Unlimited chat with AI wellness buddy',
            'Daily affirmations & mood journal with analytics',
            'Full access to therapy-inspired self-help modules (stress, anxiety, sleep, focus)',
            '1 personalized progress report at the end of the month',
            'Early Access to SereneSoul Monitoring Device. (In - Development)',
        ],
    },
];

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onBackToChat }) => {
    // State to hold the fetched payment links
    const [paymentLinks, setPaymentLinks] = useState<{ day?: string; week?: string; month?: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch links when the component mounts
    useEffect(() => {
        const fetchPaymentLinks = async () => {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("Authentication required to view plans.");
                setIsLoading(false);
                // Optionally redirect to login here
                return;
            }

            try {
                const apiBase = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080';
                const response = await fetch(`${apiBase}/api/payment/links`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch payment links.');
                }

                const links = await response.json();
                setPaymentLinks(links);
            } catch (err: any) {
                setError(err.message || "Could not load subscription options.");
                console.error("Fetch payment links error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentLinks();
    }, []); // Empty dependency array means run once on mount

    const cardBaseClasses = "relative group transform transition-all duration-300 hover:scale-105 cursor-pointer rounded-[2rem] shadow-lg bg-blue-500 text-white flex flex-col hover:shadow-[0_25px_60px_-15px_rgba(59,130,246,0.3)] h-full";
    const buttonClasses = "mt-10 w-full bg-white bg-opacity-20 backdrop-blur-sm text-white font-bold py-4 px-4 rounded-full text-lg group-hover:bg-opacity-100 group-hover:bg-white group-hover:text-blue-500 transition-colors duration-300 text-center block";

    return (
        <div className="min-h-screen bg-[#f0f4f8]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                 {/* ... (header remains the same) */}
                <header className="flex justify-between items-center mb-12">
                     <SereinSoulLogo className="w-40 h-auto md:w-64" />
                     <button
                         onClick={onBackToChat}
                         className="flex items-center text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                     >
                         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                         Back to Chat
                     </button>
                 </header>

                <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#0D244F] mb-16">Choose Your Plan</h2>

                {isLoading && <p className="text-center text-gray-600">Loading plans...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}

                {!isLoading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-20 lg:gap-8">
                        {initialPlans.map((plan) => {
                            // Get the correct link from state based on plan key
                            const paymentUrl = paymentLinks[plan.key];

                            return (
                                <div key={plan.title} className={cardBaseClasses}>
                                    {/* ... (Card content remains the same) */}
                                     <div className="text-center px-8 pt-8">
                                         <h3 className="text-4xl font-bold leading-tight tracking-tight">{plan.title}</h3>
                                     </div>

                                     {/* Separator */}
                                     <div className="relative my-8">
                                         <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#f0f4f8]"></div>
                                         <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#f0f4f8]"></div>
                                         <div className="mx-8 border-t-2 border-dashed border-white/30"></div>
                                     </div>

                                     <div className="flex-grow flex flex-col px-8 pb-8">
                                         <p className="font-semibold text-lg">Validity: {plan.validity}</p>
                                         <ul className="mt-6 space-y-4 text-sm flex-grow">
                                             {plan.features.map((feature, i) => (
                                                 <li key={i} className="flex items-start">
                                                     <span className="text-xl leading-none mr-3 mt-0.5">•</span>
                                                     <span>{feature}</span>
                                                 </li>
                                             ))}
                                         </ul>
                                    {/* Use the fetched paymentUrl */}
                                    {paymentUrl ? (
                                        <a
                                            href={paymentUrl} // Use link from state
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={buttonClasses}
                                        >
                                            Subscribe
                                        </a>
                                    ) : (
                                        // Optional: Show a placeholder or disabled button if link is missing
                                        <button
                                            disabled
                                            className={`${buttonClasses} opacity-50 cursor-not-allowed`}
                                        >
                                            Subscribe
                                        </button>
                                    )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionPage;