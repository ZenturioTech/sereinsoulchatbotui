import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import SignInPage from './pages/SignInPage';
import ChatPage from './pages/ChatPage';
import SubscriptionPage from './pages/SubscriptionPage';

const App: React.FC = () => {
  const [page, setPage] = useState<'home' | 'signIn' | 'chat' | 'subscription'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignInClick = () => {
    setPage('signIn');
  };

  const handleSignInSuccess = () => {
    setIsAuthenticated(true);
    setPage('chat');
  };

  const handleStartHealing = () => {
    if (isAuthenticated) {
      setPage('chat');
    } else {
      setPage('signIn');
    }
  };
  
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setPage('home');
  };
  
  const handleUpgrade = () => {
    setPage('subscription');
  };

  const handleBackToChat = () => {
    setPage('chat');
  };


  if (page === 'signIn') {
    return <SignInPage onSignInSuccess={handleSignInSuccess} />;
  }

  if (page === 'chat') {
    return <ChatPage onUpgrade={handleUpgrade} />;
  }

  if (page === 'subscription') {
    return <SubscriptionPage onBackToChat={handleBackToChat} />;
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center font-sans">
      <div className="w-full max-w-[1440px] p-4 sm:p-6 md:p-8 lg:p-12">
        <Header 
          isAuthenticated={isAuthenticated} 
          onSignInClick={handleSignInClick} 
          onSignOut={handleSignOut}
        />
        <main className="mt-4 md:mt-8">
          <Hero onStartHealing={handleStartHealing} />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;