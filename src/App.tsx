import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { UserActivitiesProvider } from './context/UserActivitiesContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import PetMedicarePage from './components/PetMedicarePage';
import PetFoodPage from './components/PetFoodPage';
import PetAccessoriesPage from './components/PetAccessoriesPage';
import ShoppingCart from './components/ShoppingCart';
import { ShoppingCart as CartIcon, Sparkles } from 'lucide-react';
import { useApp } from './context/AppContext';
import OrdersPage from './components/OrdersPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import UserInfo from './components/UserInfo';

type Page = 'landing' | 'login' | 'signup' | 'home' | 'orders' | 'about' | 'medicare' | 'food' | 'accessories';
type PageOrNull = Page | null;

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { cart } = useApp();
  const [currentPage, setCurrentPage] = useState<PageOrNull>('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [showCart, setShowCart] = useState(false);

  // Dynamic logout redirect
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentPage('landing');
      setActiveTab('home');
    }
  }, [isAuthenticated]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {currentPage === 'landing' && (
          <LandingPage
            onShowLogin={() => setCurrentPage('login')}
            onShowSignup={() => setCurrentPage('signup')}
          />
        )}
        
        {currentPage === 'login' && (
          <LoginPage
            onBack={() => setCurrentPage('landing')}
            onShowSignup={() => setCurrentPage('signup')}
            onLoginSuccess={() => { setActiveTab('home'); setCurrentPage('home'); }}
          />
        )}
        
        {currentPage === 'signup' && (
          <SignupPage
            onBack={() => setCurrentPage('landing')}
            onShowLogin={() => setCurrentPage('login')}
          />
        )}
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'orders':
        return <OrdersPage />;
      case 'about':
        return <AboutPage />;
      case 'medicare':
        return <PetMedicarePage />;
      case 'food':
        return <PetFoodPage />;
      case 'accessories':
        return <PetAccessoriesPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-pink-50">
      {/* Pet-themed decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Subtle paw prints */}
        <div className="absolute top-20 left-10 w-8 h-8 opacity-10">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-orange-400">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.4 7 14 7.4 14 8S14.4 9 15 9H21ZM3 9C3.6 9 4 8.6 4 8S3.6 7 3 7H1V9H3ZM19.1 3.5L17.7 2.1C17.3 1.7 16.7 1.7 16.3 2.1L15.2 3.2L16.8 4.8L17.9 3.7C18.3 3.3 18.3 2.7 17.9 2.3L19.1 3.5ZM7.2 3.2L6.1 2.1C5.7 1.7 5.1 1.7 4.7 2.1L3.6 3.2C3.2 3.6 3.2 4.2 3.6 4.6L4.7 5.7L6.3 4.1L7.2 3.2Z"/>
          </svg>
        </div>
        <div className="absolute top-40 right-20 w-6 h-6 opacity-10">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-400">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.4 7 14 7.4 14 8S14.4 9 15 9H21ZM3 9C3.6 9 4 8.6 4 8S3.6 7 3 7H1V9H3Z"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-16 w-7 h-7 opacity-10">
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.4 7 14 7.4 14 8S14.4 9 15 9H21Z"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Shopping Cart Button */}
        <div className="fixed top-16 sm:top-20 lg:top-24 right-4 sm:right-6 z-40">
          <button
            onClick={() => setShowCart(true)}
            className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-xl transition-all duration-300 transform hover:scale-110 group border border-orange-100"
          >
            <div className="relative">
              <CartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-orange-600 transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold animate-pulse">
                  {cartItemCount}
                </span>
              )}
              <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400 absolute -top-1 -left-1 animate-wiggle" />
            </div>
          </button>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="animate-fade-in">
            {renderActiveTab()}
          </div>
        </div>
      </div>

      <ShoppingCart isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <UserActivitiesProvider>
          <ErrorBoundary>
            <MainApp />
          </ErrorBoundary>
        </UserActivitiesProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;