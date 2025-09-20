import React, { useState } from 'react';
import { Pet } from '../types';
import { mockPets } from '../data/mockData';
import SearchBar from './SearchBar';
import PetCard from './PetCard';
import PetModal from './PetModal';

interface SearchFilters {
  type: string;
  location: string;
  size: string;
  age: string;
}

const HomePage: React.FC = () => {
  const [filteredPets, setFilteredPets] = useState<Pet[]>(mockPets);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const handleSearch = (query: string, filters: SearchFilters) => {
    let filtered = mockPets;

    // Filter by search query
    if (query) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(query.toLowerCase()) ||
        pet.breed.toLowerCase().includes(query.toLowerCase()) ||
        pet.type.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(pet => pet.type === filters.type);
    }

    if (filters.location) {
      filtered = filtered.filter(pet => pet.location === filters.location);
    }

    if (filters.size) {
      filtered = filtered.filter(pet => pet.size === filters.size);
    }

    if (filters.age) {
      filtered = filtered.filter(pet => {
        if (filters.age === 'young') return pet.age <= 2;
        if (filters.age === 'adult') return pet.age >= 3 && pet.age <= 6;
        if (filters.age === 'senior') return pet.age >= 7;
        return true;
      });
    }

    setFilteredPets(filtered);
  };

  return (
    <div className="space-y-6 sm:space-y-8 bg-white min-h-screen">
      <div className="text-center px-4 bg-gradient-to-r from-blue-50 to-purple-50 py-12 rounded-2xl mx-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
          Find Your Perfect <span className="text-orange-500">Companion</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Discover loving pets waiting for their forever homes. Each pet is carefully vetted and ready to bring joy to your family.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="text-center px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          Available Pets ({filteredPets.length})
        </h2>
      </div>

      {filteredPets.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-gray-500 text-lg">No pets found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onClick={setSelectedPet}
            />
          ))}
        </div>
      )}

      {selectedPet && (
        <PetModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </div>
  );
};

export default HomePage;