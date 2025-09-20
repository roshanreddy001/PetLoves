import React from 'react';
import { MapPin, Heart, User, Calendar, Star } from 'lucide-react';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  onClick: (pet: Pet) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onClick }) => {
  return (
    <div
      onClick={() => onClick(pet)}
      className="card-premium rounded-xl sm:rounded-2xl overflow-hidden card-hover cursor-pointer group animate-fade-in"
    >
      <div className="relative h-40 sm:h-48 lg:h-56 overflow-hidden">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 glass-effect rounded-full p-2 sm:p-3 transform group-hover:scale-110 transition-transform duration-300">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 group-hover:fill-current transition-all duration-300" />
        </div>
        
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <span className={`badge text-xs sm:text-sm ${
            pet.size === 'small' ? 'badge-green' :
            pet.size === 'medium' ? 'badge-orange' :
            'badge-red'
          }`}>
            {pet.size}
          </span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{pet.name}</h3>
          <p className="text-white/90 font-medium text-sm sm:text-base">{pet.breed}</p>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
              <span className="text-xs sm:text-sm font-medium">{pet.breed}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">4.8</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
            <span className="text-xs sm:text-sm font-medium">{pet.age} years old • {pet.gender}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
            <span className="text-xs sm:text-sm font-medium">{pet.location}</span>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 flex items-center justify-between">
          <span className="badge badge-blue capitalize text-xs sm:text-sm">
            {pet.type}
          </span>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">Available for</p>
            <p className="text-sm sm:text-lg font-bold text-gradient">Adoption</p>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;