// ./frontend/App.tsx
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import SignInPage from './pages/SignInPage';
import ChatPage from './pages/ChatPage';
import SubscriptionPage from './pages/SubscriptionPage';

const App: React.FC = () => {
  const [page, setPage] = useState<'home' | 'signIn' | 'chat' | 'subscription'>('home'); // Initialize to 'home'
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  // Function to handle login (sets token state and localStorage)
  const handleLogin = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  // Initialize auth state and set up popstate listener
  useEffect(() => {
    // Check auth status on load
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);

    // --- MODIFICATION START ---
    // Always force the page to 'home' on initial load/refresh,
    // ignoring browser history state for the initial render.
    setPage('home');
    history.replaceState({ page: 'home' }, ''); // Reset history state to match
    // --- MODIFICATION END ---


    // Listener for browser back/forward navigation
    const onPopState = (e: PopStateEvent) => {
      const nextPage = (e.state && e.state.page) || 'home'; // Default to home if state is missing
      setPage(nextPage);
      // Keep token state synced with localStorage during navigation
      setToken(localStorage.getItem('authToken'));
    };
    window.addEventListener('popstate', onPopState);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('popstate', onPopState);
  }, []); // Empty dependency array ensures this runs only once on mount


  // Navigation function - pushes state to history
  const navigate = (nextPage: 'home' | 'signIn' | 'chat' | 'subscription') => {
    if (page !== nextPage) {
        setPage(nextPage);
        history.pushState({ page: nextPage }, '');
    } else {
       setPage(nextPage); // Still update state if called for the same page
    }
  };


  const handleSignInClick = () => {
    navigate('signIn');
  };

  const handleSignInSuccess = (receivedToken: string) => {
    handleLogin(receivedToken);
    navigate('chat');
  };

  // Determines where "Start Healing" button goes
  const handleStartHealing = () => {
    if (token) { // Check token state directly
      navigate('chat');
    } else {
      navigate('signIn');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('phoneNumber');
    setToken(null);
    navigate('home'); // Go to home after sign out
  };

  const handleUpgrade = () => {
    navigate('subscription');
  };

  const handleBackToChat = () => {
    navigate('chat');
  };


  // --- Render Logic ---
  let currentPageComponent;
  if (page === 'signIn' && !token) {
    currentPageComponent = <SignInPage onSignInSuccess={handleSignInSuccess} />;
  } else if (page === 'chat' && token) {
    currentPageComponent = <ChatPage onUpgrade={handleUpgrade} token={token} />;
  } else if (page === 'subscription' && token) {
    currentPageComponent = <SubscriptionPage onBackToChat={handleBackToChat} />;
  } else {
    // Default to rendering the home page for 'home' state or any unexpected state
    currentPageComponent = (
        <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center font-sans">
            <div className="w-full max-w-[1440px] p-4 sm:p-6 md:p-8 lg:p-12">
                <Header
                    isAuthenticated={!!token} // Auth status based on token
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
     // If the state somehow got stuck on something invalid, force navigate back to home
     if (page !== 'home') {
         console.warn(`Invalid page state "${page}" detected, redirecting to home.`);
         navigate('home');
     }
  }

  return currentPageComponent; // Render the determined component
}

export default App;