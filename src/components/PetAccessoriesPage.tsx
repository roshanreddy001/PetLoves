import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Filter, Search, CreditCard } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

const PetAccessoriesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useApp();

  const accessoryProducts = mockProducts.filter(product => 
    product.category === 'accessory' || product.category === 'toy' || product.category === 'healthcare'
  );

  const filteredProducts = accessoryProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    const matchesAnimal = selectedAnimal === '' || product.animalType.includes(selectedAnimal);
    return matchesSearch && matchesCategory && matchesAnimal;
  });

  const categories = [
    { value: 'accessory', label: 'Accessories' },
    { value: 'toy', label: 'Toys' },
    { value: 'healthcare', label: 'Healthcare' }
  ];

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
      <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 py-12 rounded-2xl mx-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Pet <span className="text-purple-500">Accessories</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything your pet needs for comfort, play, and health. From toys and carriers to grooming products.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mx-4 border border-purple-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for pet accessories..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {showFilters && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Animal Type
                </label>
                <select
                  value={selectedAnimal}
                  onChange={(e) => setSelectedAnimal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-100">
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
                  <div className="absolute top-4 left-4 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {categories.find(c => c.value === product.category)?.label}
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
                        className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                      >
                        {animal}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-purple-500">
                    ₹{product.price}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default PetAccessoriesPage;