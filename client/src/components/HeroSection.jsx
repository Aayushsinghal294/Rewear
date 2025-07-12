import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Users, Shirt, Recycle, ArrowRight, Heart, Eye } from 'lucide-react';
import { itemAPI } from '../services/api';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock featured items data - replace with actual API call
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        // You can create a dedicated endpoint for featured items, or use your existing one with filters
        // Example: GET /api/items/featured or GET /api/items?featured=true
        const res = await fetch('http://localhost:5000/api/items/featured');
        const data = await res.json();
        setFeaturedItems(data.items || data); // adapt if your API returns { items: [...] }
      } catch (error) {
        setFeaturedItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedItems();
  }, []);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  const stats = [
    { icon: Users, label: "Active Users", value: "2.5K+" },
    { icon: Shirt, label: "Items Swapped", value: "8.2K+" },
    { icon: Recycle, label: "CO2 Saved", value: "1.2T" },
    { icon: Star, label: "Avg Rating", value: "4.8" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-teal-50 mt-25">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-teal-600/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Give Your Clothes a
            <span className="text-yellow-600 block">Second Life</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the sustainable fashion revolution. Swap, trade, and discover amazing pre-loved clothing while reducing textile waste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2">
              Start Swapping
              <ArrowRight size={20} />
            </button>
            <button className="border-2 border-yellow-600 text-yellow-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-50 transition-colors">
              List an Item
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <stat.icon className="text-yellow-600" size={32} />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Featured Items
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredItems.map((item) => (
                    <div key={item.id} className="w-full flex-shrink-0">
                      <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl p-8 mx-4">
                        <div className="relative">
                          <img
  src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder.jpg'}
  alt={item.title}
  className="w-full h-80 object-cover rounded-xl"
/>
                          <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                            <Heart className="text-red-500" size={20} />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                              {item.category}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              Size {item.size}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye size={16} />
                              {item.views} views
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart size={16} />
                              {item.likes} likes
                            </div>
                           <div className="flex items-center gap-1">
  <Star size={16} className="text-yellow-500" />
  {item.owner && item.owner.rating ? item.owner.rating : 'N/A'}
</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-yellow-600">
                              {item.pointsValue} points
                            </div>
                            <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronRight size={24} />
              </button>
              
              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 space-x-2">
                {featuredItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-yellow-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How ReWear Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">List Your Items</h3>
              <p className="text-gray-600">
                Upload photos and details of clothes you no longer wear. Set your preferred swap method.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Browse & Swap</h3>
              <p className="text-gray-600">
                Discover amazing items from other users. Make direct swaps or use points to redeem items.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Enjoy & Repeat</h3>
              <p className="text-gray-600">
                Receive your new-to-you items and continue the cycle of sustainable fashion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl text-yellow-100 mb-8">
            Join thousands of users who are already making a difference, one swap at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-yellow-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Items
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors">
              List Your First Item
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;