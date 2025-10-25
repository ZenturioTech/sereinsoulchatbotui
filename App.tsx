// ./frontend/App.tsx
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import SignInPage from './pages/SignInPage';
import ChatPage from './pages/ChatPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminPage from './pages/AdminPage';

interface DecodedToken {
    phoneNumber: string;
    isAdmin: boolean;
    iat: number;
    exp: number;
}

const App: React.FC = () => {
  const [page, setPage] = useState<'home' | 'signIn' | 'chat' | 'subscription'| 'admin'>('home'); // Initialize to 'home'
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const handleLogin = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    try {
        const decoded = jwtDecode<DecodedToken>(newToken);
        setIsAdmin(decoded.isAdmin || false);
        console.log("handleLogin: Decoded admin status:", decoded.isAdmin);
    } catch (e) {
        console.error("Failed to decode token during login:", e);
        setIsAdmin(false);
    }
  };

  // Initialize auth state and set up popstate listener
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);
    // --- Set initial admin state based on stored token ---
    if (storedToken) {
        try {
            const decoded = jwtDecode<DecodedToken>(storedToken);
            setIsAdmin(decoded.isAdmin || false);
            console.log("useEffect on mount: Initial admin status from stored token:", decoded.isAdmin);
        } catch (e) {
            console.error("Failed to decode stored token on mount:", e);
            setIsAdmin(false); // Assume not admin if token is invalid
            // Optionally clear invalid token: localStorage.removeItem('authToken'); setToken(null);
        }
    } else {
         setIsAdmin(false); // No token, not admin
    }
    // -----------------------------------------------------

    // Always force the page to 'home' on initial load/refresh
    setPage('home');
    history.replaceState({ page: 'home' }, '');

    // Listener for browser back/forward navigation
    const onPopState = (e: PopStateEvent) => {
      const nextPage = (e.state && e.state.page) || 'home';
      setPage(nextPage);
      // Re-check token and admin status on navigation
      const currentToken = localStorage.getItem('authToken');
      setToken(currentToken);
      if (currentToken) {
          try {
              const decoded = jwtDecode<DecodedToken>(currentToken);
              setIsAdmin(decoded.isAdmin || false);
          } catch { setIsAdmin(false); }
      } else {
           setIsAdmin(false);
      }
    };
    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, []); // Empty dependency array ensures this runs only once on mount


  // Navigation function - pushes state to history
  const navigate = (nextPage: 'home' | 'signIn' | 'chat' | 'subscription' | 'admin') => {
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

    const handleAdminSignInSuccess = (receivedToken: string) => {
      handleLogin(receivedToken);
      navigate('admin'); // Navigate admin to admin page
  };

  // Determines where "Start Healing" button goes
  const handleStartHealing = () => {
    if (token) {
        console.log("handleStartHealing: Token exists, checking admin status:", isAdmin);
        if (isAdmin) {
            navigate('admin'); // Go to admin page if user is admin
        } else {
            navigate('chat'); // Go to chat page if regular user
        }
    } else {
        navigate('signIn'); // Go to login if no token
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('activeChatSessionId');
    setToken(null);
    setIsAdmin(false); // Reset admin state on logout
    navigate('home');
  };

  const handleUpgrade = () => {
    navigate('subscription');
  };

  const handleBackToChat = () => {
    navigate('chat');
  };

  const handleBackToHome = () => {
    navigate('home');
  };


  // --- Render Logic ---
  let currentPageComponent;
  if (page === 'signIn' && !token) {
  currentPageComponent = <SignInPage onSignInSuccess={handleSignInSuccess} onAdminSignInSuccess={handleAdminSignInSuccess} />;
  }  else if (page === 'chat' && token) {
    currentPageComponent = <ChatPage onUpgrade={handleUpgrade} token={token} onBackToHome={handleBackToHome} />;
  } else if (page === 'subscription' && token) {
    currentPageComponent = <SubscriptionPage onBackToChat={handleBackToChat} />;
  } else if (page === 'admin' && token) {
      currentPageComponent = <AdminPage token={token} onSignOut={handleSignOut} />;
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
     if (page === 'admin' && (!token || !isAdmin)) navigate('home');
     if (page === 'chat' && isAdmin) navigate('admin'); // Redirect admin from chat attempt to admin page
     if (page === 'subscription' && token && isAdmin) navigate('admin');
     else if (page !== 'home' && !token && page !== 'signIn') navigate('home'); // Redirect logged out users from protected pages
     else if (page !== 'home' && page !== 'admin' && page !== 'chat' && page !== 'subscription' && page !== 'signIn') navigate('home');
  }

  return currentPageComponent; // Render the determined component
}

export default App;