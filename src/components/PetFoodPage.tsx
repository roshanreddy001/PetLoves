import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Filter, Search, CreditCard } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

const PetFoodPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useApp();

  const foodProducts = mockProducts.filter(product => product.category === 'food');

  const filteredProducts = foodProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAnimal = selectedAnimal === '' || product.animalType.includes(selectedAnimal);
    return matchesSearch && matchesAnimal;
  });

  const animalTypes = ['dog', 'cat', 'bird'];

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    // In a real app, this would redirect to checkout
    alert('Added to cart! Click the cart icon to proceed to checkout.');
  };

  return (
    <div className="space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-orange-50 to-red-50 py-12 rounded-2xl mx-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Pet <span className="text-orange-500">Food</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Premium nutrition for your beloved pets. High-quality food products for dogs, cats, birds, and more.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mx-4 border border-orange-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for pet food..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {showFilters && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal Type
                </label>
                <select
                  value={selectedAnimal}
                  onChange={(e) => setSelectedAnimal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Animals</option>
                  {animalTypes.map(animal => (
                    <option key={animal} value={animal}>
                      {animal.charAt(0).toUpperCase() + animal.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="space-y-6 mx-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Available Products ({filteredProducts.length})
        </h2>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-orange-100">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Food
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.animalType.map((animal, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
                      >
                        {animal}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-orange-500">
                    ₹{product.price}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    
                    <button
                      onClick={() => handleBuyNow(product)}
                      disabled={!product.inStock}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetFoodPage;