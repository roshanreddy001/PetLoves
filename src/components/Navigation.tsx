import React, { useState } from 'react';
import UserInfo from './UserInfo';
import { Menu, X, Home, Users, Heart, ShoppingBag, Stethoscope, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { logout } = useAuth();
  // Reset navigation to landing after logout
  const handleLogout = () => {
    logout();
    if (onTabChange) {
      onTabChange('landing');
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, color: 'from-blue-500 to-purple-600' },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, color: 'from-yellow-500 to-orange-500' },
    { id: 'about', label: 'About Us', icon: Users, color: 'from-green-500 to-teal-600' },
    { id: 'medicare', label: 'Pet Medicare', icon: Stethoscope, color: 'from-red-500 to-pink-600' },
    { id: 'food', label: 'Pet Food', icon: Heart, color: 'from-orange-500 to-red-600' },
    { id: 'accessories', label: 'Pet Accessories', icon: ShoppingBag, color: 'from-purple-500 to-indigo-600' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between p-4 xl:p-6 bg-white shadow-lg border-b border-orange-100">
        <div className="flex items-center space-x-2 xl:space-x-3">
          <div className="relative">
            <Heart className="w-8 h-8 xl:w-10 xl:h-10 text-red-500 animate-pulse" />
            <Sparkles className="w-3 h-3 xl:w-4 xl:h-4 text-yellow-400 absolute -top-1 -right-1 animate-wiggle" />
          </div>
          <span className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">PetLove</span>
        </div>
        
        <div className="flex items-center space-x-1 xl:space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`nav-item flex items-center space-x-1 xl:space-x-2 px-3 xl:px-6 py-2 xl:py-3 rounded-lg xl:rounded-xl transition-all duration-300 font-semibold text-sm xl:text-base ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-700 hover:bg-orange-50 hover:shadow-md hover:scale-105'
                }`}
              >
                <Icon className="w-4 h-4 xl:w-5 xl:h-5" />
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center space-x-4">
          <UserInfo handleLogout={handleLogout} />
        </div>
      </nav>

      {/* Tablet Navigation */}
      <nav className="hidden md:flex lg:hidden items-center justify-between p-4 bg-white shadow-lg border-b border-orange-100">
        <div className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-red-500 animate-pulse" />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">PetLove</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`nav-item flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-300 font-medium text-xs ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'text-gray-700 hover:bg-orange-50 hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span>{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="nav-item flex flex-col items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-md transition-all duration-300 font-medium text-xs ml-2"
          >
            <LogOut className="w-4 h-4 mb-1" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 bg-white shadow-lg border-b border-orange-100">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500 animate-pulse" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">PetLove</span>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-orange-50 transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-lg border-b border-orange-100 z-50 animate-slide-up">
            <div className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsMenuOpen(false);
                    }}
                    className={`nav-item flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-300 font-semibold ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'text-gray-700 hover:bg-orange-50 hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="nav-item flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-md transition-all duration-300 font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;