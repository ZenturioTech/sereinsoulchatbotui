import React from 'react';
import SereinSoulLogo from '../components/icons/SereinSoulLogo';

interface SubscriptionPageProps {
  onBackToChat: () => void;
}

const plans = [
    {
        title: 'Day Pass',
        validity: '24hrs',
        paymentUrl: 'https://rzp.io/rzp/qFcUzPR',
        features: [
            'Unlimited chat with AI wellness buddy',
            'Access to guided meditations & relaxation audio',
            'Mood tracking & journaling for 1 day',
            'Quick stress-relief exercises',
        ],
    },
    {
        title: 'Week Pass',
        validity: '7 Days',
        paymentUrl: 'https://rzp.io/rzp/u6HlXzS',
        features: [
            'Unlimited chat with AI wellness buddy',
            'Daily personalized affirmations',
            '7-day mental fitness challenge (breathing, journaling, mindfulness tasks)',
            'Access to curated content (WHO & NHS-based self-care guides)',
            'Progress summary at the end of the week',
        ],
    },
    {
        title: 'Month Pass',
        validity: '30 Days',
         paymentUrl: 'https://rzp.io/rzp/oX9U49g',
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
    const cardBaseClasses = "relative group transform transition-all duration-300 hover:scale-105 cursor-pointer rounded-[2rem] shadow-lg bg-blue-500 text-white flex flex-col hover:shadow-[0_25px_60px_-15px_rgba(59,130,246,0.3)] h-full";
    const buttonClasses = "mt-10 w-full bg-white bg-opacity-20 backdrop-blur-sm text-white font-bold py-4 px-4 rounded-full text-lg group-hover:bg-opacity-100 group-hover:bg-white group-hover:text-blue-500 transition-colors duration-300";

    return (
        <div className="min-h-screen bg-[#f0f4f8] font-sans">
            <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-20 lg:gap-8">
                    {plans.map((plan) => (
                        <div key={plan.title} className={cardBaseClasses}>
                            <div className="text-center px-8 pt-8">
                                <h3 className="text-4xl font-bold leading-tight tracking-tight">{plan.title}</h3>
                            </div>

                            {/* Separator */}
                            <div className="relative my-8">
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white"></div>
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white"></div>
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
                                 <button 
                                    className={buttonClasses}
                                    onClick={() => window.open(plan.paymentUrl, '_blank')}
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;