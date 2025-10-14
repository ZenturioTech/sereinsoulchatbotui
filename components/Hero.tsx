import React from 'react';
import { HealingIcon } from './icons/HealingIcon';
import { ArrowIcon } from './icons/ArrowIcon';
import { YogaIcon } from './icons/YogaIcon';
import { BookIcon } from './icons/BookIcon';
import { ChatIcon } from './icons/ChatIcon';
import { GameIcon } from './icons/GameIcon';

const FloatingIconButton: React.FC<{ icon: React.ReactNode; className: string }> = ({ icon, className }) => (
    <div className={`absolute w-16 h-16 md:w-20 md:h-20 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg ${className}`}>
        {icon}
    </div>
);

interface HeroProps {
  onStartHealing: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartHealing }) => {
  return (
    <>
      <div className="relative">
        {/* Main hero card */}
        <div 
            className="relative w-full h-[85vh] max-h-[700px] md:h-[720px] bg-cover bg-center text-white p-8 flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:p-12 lg:p-20
            rounded-[2.5rem] md:rounded-[2.5rem] mobile-cutout overflow-hidden"
            style={{
                backgroundImage: 'url(https://i.ibb.co/WWvw6bXN/ssocean-1.png)'
            }}
        >
            
            <div className="relative z-10 w-full md:max-w-xl mt-5">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-md">
                    You Deserve Someone Who Listens
                </h1>
                <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl drop-shadow-sm">
                    India's first AI-powered digital twin platform for sustainable mental well-being.
                </p>
            </div>

            <div className="absolute inset-0 z-0">
                {/* Character Image and Aura Effect */}
                <div className="absolute bottom-0 md:bottom-0 left-1/2 -translate-x-1/2 h-[70%] w-auto md:left-auto md:translate-x-0 md:right-0 lg:right-20 md:h-[90%] pointer-events-none flex items-end md:items-center justify-center ">
                    {/* Aura circles for desktop */}
                    <div className="hidden md:block absolute w-[400px] h-[400px] bg-white/5 rounded-full"></div>
                    <div className="hidden md:block absolute w-[550px] h-[550px] bg-white/5 rounded-full"></div>
                    <div className="hidden md:block absolute w-[700px] h-[700px] bg-white/5 rounded-full"></div>

                    <img 
                        src="https://i.ibb.co/DPv8sR0J/imag.png"
                        alt="AI Assistant"
                        className="relative w-auto h-full object-bottom object-contain left-[32%] md:left-[12%]"
                    />
                </div>

                {/* Mobile Icon Positions */}
              <FloatingIconButton icon={<YogaIcon />} className="top-[48%] left-[15%] md:hidden" />
                <FloatingIconButton icon={<BookIcon />} className="top-[45%] right-[30%] md:hidden" />
                <FloatingIconButton icon={<ChatIcon />} className="bottom-[25%] left-[12%] md:hidden" />
                <FloatingIconButton icon={<GameIcon />} className="bottom-[35%] right-[3%] md:hidden" />
                
                {/* Desktop Icon Positions */}
                <FloatingIconButton icon={<YogaIcon />} className="hidden md:flex top-[15%] right-[30%]" />
                <FloatingIconButton icon={<BookIcon />} className="hidden md:flex top-[30%] right-[8%]" />
                <FloatingIconButton icon={<ChatIcon />} className="hidden md:flex bottom-[35%] right-[40%]" />
                <FloatingIconButton icon={<GameIcon />} className="hidden md:flex bottom-[18%] right-[5%]" />
            </div>
        </div>

        {/* Desktop "Start Healing" button */}
        <div className="hidden absolute bottom-0 left-0 z-20 md:block">
            <button 
                onClick={onStartHealing}
                className="relative bg-[#a8d0f1] text-[#0D244F] w-48 h-48 rounded-tr-[2.5rem] rounded-br-[2.5rem] rounded-bl-[2.5rem] shadow-[inset_5px_5px_10px_#86a7c1,inset_-5px_-5px_10px_#caffff] flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95">
                <div className="absolute top-6 right-6">
                   <ArrowIcon />
                </div>
                <HealingIcon />
                <span className="text-2xl font-semibold text-black">Start Healing</span>
            </button>
        </div>

        {/* Mobile "Start Healing" button in cutout area */}
        <div className="absolute bottom-0 left-0 z-20 md:hidden">
            <button 
                onClick={onStartHealing}
                className="w-28 h-28 bg-[#a8d0f1] rounded-tr-[2rem] rounded-br-[2rem] rounded-bl-[2rem] flex flex-col items-center justify-center gap-1 shadow-[inset_3px_3px_6px_#86a7c1,inset_-3px_-3px_6px_#caffff] transition-transform hover:scale-105 active:scale-95">
                <HealingIcon className="w-8 h-8" />
                <span className="font-bold text-sm text-[#0D244F] leading-tight">Start<br/>Healing</span>
                <div className="absolute top-3 right-3 w-5 h-5">
                    <ArrowIcon className="w-full h-full" />
                </div>
            </button>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .mobile-cutout::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 128px;
            height: 128px;
            background-color: #f0f4f8;
            border-top-right-radius: 2rem;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-cutout::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 208px; /* 13rem */
            height: 208px; /* 13rem */
            background-color: #f0f4f8;
            border-top-right-radius: 2.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Hero;