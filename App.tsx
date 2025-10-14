import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import SignInPage from './pages/SignInPage';
import ChatPage from './pages/ChatPage';
import SubscriptionPage from './pages/SubscriptionPage';

const App: React.FC = () => {
  const [page, setPage] = useState<'home' | 'signIn' | 'chat' | 'subscription'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth and route on first load and handle browser back/forward
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(storedAuth);
    // Always land on home after refresh regardless of auth
    setPage('home');

    // Set initial history state
    if (!history.state || history.state.page !== 'home') {
      history.replaceState({ page: 'home' }, '');
    }

    const onPopState = (e: PopStateEvent) => {
      const nextPage = (e.state && e.state.page) || 'home';
      setPage(nextPage);
      // Keep auth persisted across navigation
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextPage: 'home' | 'signIn' | 'chat' | 'subscription') => {
    setPage(nextPage);
    history.pushState({ page: nextPage }, '');
  };

  const handleSignInClick = () => {
    navigate('signIn');
  };

  const handleSignInSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    navigate('chat');
  };

  const handleStartHealing = () => {
    if (isAuthenticated) {
      navigate('chat');
    } else {
      navigate('signIn');
    }
  };
  
  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('phoneNumber');
    navigate('home');
  };
  
  const handleUpgrade = () => {
    navigate('subscription');
  };

  const handleBackToChat = () => {
    navigate('chat');
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