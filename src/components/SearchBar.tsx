import React, { useState } from 'react';
import { Search, Filter, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

interface SearchFilters {
  type: string;
  location: string;
  size: string;
  age: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: '',
    location: '',
    size: '',
    age: '',
  });

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      size: '',
      age: '',
    });
    setQuery('');
    onSearch('', { type: '', location: '', size: '', age: '' });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || query !== '';

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 animate-fade-in mx-4 border border-blue-100">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for pets by name, breed, or type..."
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 flex-shrink-0 ${
              showFilters || hasActiveFilters
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg flex items-center space-x-2 flex-shrink-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            <span className="hidden sm:inline">Search</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center space-x-2 mb-3 sm:mb-0">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span>Advanced Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-red-500 flex items-center space-x-1 transition-colors"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                Pet Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="">All Types</option>
                <option value="dog">🐕 Dog</option>
                <option value="cat">🐱 Cat</option>
                <option value="bird">🐦 Bird</option>
                <option value="other">🐾 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="">All Locations</option>
                <option value="New York, NY">📍 New York, NY</option>
                <option value="Los Angeles, CA">📍 Los Angeles, CA</option>
                <option value="Chicago, IL">📍 Chicago, IL</option>
                <option value="Miami, FL">📍 Miami, FL</option>
                <option value="Seattle, WA">📍 Seattle, WA</option>
                <option value="Boston, MA">📍 Boston, MA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                Size
              </label>
              <select
                value={filters.size}
                onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="">All Sizes</option>
                <option value="small">🐁 Small</option>
                <option value="medium">🐕 Medium</option>
                <option value="large">🐕‍🦺 Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                Age
              </label>
              <select
                value={filters.age}
                onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="">All Ages</option>
                <option value="young">🐶 Young (0-2 years)</option>
                <option value="adult">🐕 Adult (3-6 years)</option>
                <option value="senior">🐕‍🦺 Senior (7+ years)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;