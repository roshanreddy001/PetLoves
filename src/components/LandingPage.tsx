import React, { useEffect, useState } from 'react';
import { Heart, Shield, MapPin, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onShowLogin: () => void;
  onShowSignup: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowLogin, onShowSignup }) => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; size: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      size: Math.random() * 4 + 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-yellow-500 animate-gradient">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-orange-300/30 to-red-600/40 animate-pulse-slow"></div>
        
        {/* Floating geometric shapes - responsive sizes */}
        <div className="absolute top-10 left-10 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-yellow-300/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-orange-300/20 rounded-full animate-bounce-slow delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-red-300/20 rounded-full animate-bounce-slow delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-yellow-400/20 rotate-45 animate-bounce-slow delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-orange-400/20 rounded-full animate-bounce-slow delay-1000"></div>
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle bg-white/20"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Pet Images - responsive positioning */}
      <div className="absolute inset-0 opacity-30">
        <img
          src="https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=200"
          alt="Dog"
          className="absolute top-20 left-4 sm:left-20 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover animate-float shadow-2xl border-4 border-white/30"
        />
        <img
          src="https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=200"
          alt="Cat"
          className="absolute top-40 right-4 sm:right-32 w-18 h-18 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover animate-float delay-200 shadow-2xl border-4 border-white/30"
        />
        <img
          src="https://images.pexels.com/photos/1661535/pexels-photo-1661535.jpeg?auto=compress&cs=tinysrgb&w=200"
          alt="Bird"
          className="absolute bottom-32 left-4 sm:left-16 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full object-cover animate-float delay-400 shadow-2xl border-4 border-white/30"
        />
        <img
          src="https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=200"
          alt="Dog"
          className="absolute bottom-20 right-4 sm:right-20 w-20 h-20 sm:w-22 sm:h-22 lg:w-26 lg:h-26 rounded-full object-cover animate-float delay-600 shadow-2xl border-4 border-white/30"
        />
      </div>

      {/* Main Content - responsive layout */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="glass-effect rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full card-hover animate-fade-in">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 animate-pulse" />
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-300 absolute -top-1 sm:-top-2 -right-1 sm:-right-2 animate-wiggle" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3 text-gradient animate-gradient">
              PetLove
            </h1>
            <p className="text-white/90 text-lg sm:text-xl font-medium">Find Your Perfect Companion</p>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-yellow-400 to-red-400 mx-auto mt-3 sm:mt-4 rounded-full"></div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="flex items-center space-x-3 p-3 sm:p-4 glass-effect rounded-lg sm:rounded-xl card-hover">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <span className="text-white font-semibold text-sm sm:text-base">Safe & Secure Adoption</span>
                  <p className="text-white/70 text-xs sm:text-sm">Verified pets and trusted process</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 sm:p-4 glass-effect rounded-lg sm:rounded-xl card-hover">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <span className="text-white font-semibold text-sm sm:text-base">Local Pet Care Services</span>
                  <p className="text-white/70 text-xs sm:text-sm">Find nearby vets and services</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={onShowLogin}
                className="w-full btn-primary text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg shadow-2xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Login</span>
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </button>
              
              <button
                onClick={onShowSignup}
                className="w-full btn-glass text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg border-2 border-white/30"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Sign Up</span>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </button>
            </div>

            <div className="text-center pt-3 sm:pt-4">
              <p className="text-white/80 text-xs sm:text-sm">
                Join thousands of happy pet families
              </p>
              <div className="flex justify-center space-x-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;