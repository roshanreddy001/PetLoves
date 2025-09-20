import React from 'react';
import { Heart, Users, Shield, Award, Target, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 bg-white min-h-screen">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-green-50 to-teal-50 py-12 rounded-2xl mx-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          About <span className="text-orange-500">PetLove</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          We're passionate about connecting loving pets with caring families. Our mission is to make pet adoption accessible, transparent, and joyful for everyone involved.
        </p>
      </div>

      {/* Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-8 h-8 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To create a world where every pet finds a loving home and every family finds their perfect companion. We believe that the bond between humans and animals is one of life's greatest joys, and we're here to make those connections happen.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-100">
          <div className="flex items-center space-x-3 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-800">Our Values</h2>
          </div>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Compassion for all animals</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Transparency in our processes</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Support for pet parents</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-orange-500 mt-1">•</span>
              <span>Community building</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mx-4 border border-blue-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What Makes Us Special</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Verified Pets</h3>
            <p className="text-gray-600">
              All our pets are health-checked, vaccinated, and come with complete medical records.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Support Network</h3>
            <p className="text-gray-600">
              Our community of pet lovers provides ongoing support and advice for new pet parents.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Care</h3>
            <p className="text-gray-600">
              We partner with certified veterinarians and pet care professionals to ensure the best care.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white mx-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">5,000+</div>
            <div className="text-orange-100">Pets Adopted</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">3,500+</div>
            <div className="text-orange-100">Happy Families</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">150+</div>
            <div className="text-orange-100">Partner Shelters</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">25+</div>
            <div className="text-orange-100">Cities Served</div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mx-4 border border-purple-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet Our Creator</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
         
        <div className="text-center">
            <img
              src="https://i.postimg.cc/vDj8zk7c/ROSHANBABU.jpg"
              alt="Roshan Reddy"
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800">Roshan Reddy Basava</h3>
            <p className="text-orange-500 font-medium">23MIC7274</p> 
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-50 rounded-2xl p-8 mx-4 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Get In Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <p className="text-gray-600">
                <strong>Phone:</strong> 9949458597
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> reddyroshan976@gmail.com
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> begumpet, Hyderabad City, Talangana state
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <div className="bg-blue-500 text-white p-3 rounded-full">
                <Globe className="w-5 h-5" />
              </div>
              <div className="bg-pink-500 text-white p-3 rounded-full">
                <Heart className="w-5 h-5" />
              </div>
              <div className="bg-purple-500 text-white p-3 rounded-full">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;