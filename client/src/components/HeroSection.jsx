// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, Users, Star } from 'lucide-react';

const HeroSection = () => {
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    // Fetch featured items from API
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const response = await fetch('/api/items?limit=6');
      const data = await response.json();
      setFeaturedItems(data);
    } catch (error) {
      console.error('Error fetching featured items:', error);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-100 to-yellow-200 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Swap, Share, Sustain with <span className="text-yellow-600">ReWear</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Give your unused clothes a new life. Join our community of conscious fashion lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse" className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
              Start Browsing <ArrowRight className="inline ml-2" size={20} />
            </Link>
            <Link to="/list-item" className="bg-white hover:bg-gray-50 text-yellow-600 px-8 py-3 rounded-full font-semibold border-2 border-yellow-500 transition-all duration-300 hover:scale-105">
              List Your Item
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Recycle className="text-yellow-500 mb-4" size={48} />
              <h3 className="text-3xl font-bold text-gray-800">1,234</h3>
              <p className="text-gray-600">Items Swapped</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="text-yellow-500 mb-4" size={48} />
              <h3 className="text-3xl font-bold text-gray-800">567</h3>
              <p className="text-gray-600">Happy Members</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="text-yellow-500 mb-4" size={48} />
              <h3 className="text-3xl font-bold text-gray-800">4.8</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Featured Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={item.images[0] || '/placeholder-image.jpg'} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description.substring(0, 80)}...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-600 font-bold">{item.pointsValue} points</span>
                    <Link to={`/item/${item._id}`} className="text-yellow-600 hover:text-yellow-700 font-semibold">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;