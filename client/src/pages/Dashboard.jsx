// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Package, Star, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [userItems, setUserItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserItems();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/profile/${user.id}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserItems = async () => {
    try {
      const response = await fetch(`/api/items/user/${user.id}`);
      const data = await response.json();
      setUserItems(data);
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Points Balance</p>
                <p className="text-2xl font-bold text-yellow-600">{userData?.pointsBalance || 0}</p>
              </div>
              <TrendingUp className="text-yellow-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Items Listed</p>
                <p className="text-2xl font-bold text-blue-600">{userItems.length}</p>
              </div>
              <Package className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Swaps</p>
                <p className="text-2xl font-bold text-green-600">{userData?.totalSwaps || 0}</p>
              </div>
              <Star className="text-green-500" size={32} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/list-item" className="flex items-center gap-3 p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 transition-colors">
              <Plus className="text-yellow-500" size={24} />
              <span className="font-semibold">List New Item</span>
            </Link>
            <Link to="/browse" className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
              <Package className="text-blue-500" size={24} />
              <span className="font-semibold">Browse Items</span>
            </Link>
          </div>
        </div>

        {/* My Items */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Listed Items</h2>
          {userItems.length === 0 ? (
            <p className="text-gray-600">You haven't listed any items yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.map((item) => (
                <div key={item._id} className="border rounded-lg overflow-hidden">
                  <img 
                    src={item.images[0] || '/placeholder-image.jpg'} 
                    alt={item.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.condition} • {item.size}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-600 font-bold">{item.pointsValue} points</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'available' ? 'bg-green-100 text-green-800' : 
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;