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
      const response = await fetch(`http://localhost:5000/api/items/user/${user.id}`);
      const data = await response.json();
      setUserItems(data);
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-emerald-50 dark:from-[#18181B] dark:via-[#23272A] dark:to-[#0f2027] pt-24 pb-12">
      {/* Animated background blobs for subtle depth */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-yellow-200 opacity-25 rounded-full blur-3xl animate-blob"></div>
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-200 opacity-25 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-zinc-900 dark:text-white tracking-tight drop-shadow-lg">
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-yellow-300 p-8 flex flex-col items-center gap-2 transition-all hover:scale-105">
            <TrendingUp className="text-yellow-500 mb-2" size={40} />
            <p className="text-lg text-zinc-700 dark:text-zinc-200">Points Balance</p>
            <p className="text-3xl font-extrabold text-yellow-600 dark:text-yellow-400">{userData?.pointsBalance || 0}</p>
          </div>
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-blue-300 p-8 flex flex-col items-center gap-2 transition-all hover:scale-105">
            <Package className="text-blue-500 mb-2" size={40} />
            <p className="text-lg text-zinc-700 dark:text-zinc-200">Items Listed</p>
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{userItems.length}</p>
          </div>
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-emerald-300 p-8 flex flex-col items-center gap-2 transition-all hover:scale-105">
            <Star className="text-emerald-500 mb-2" size={40} />
            <p className="text-lg text-zinc-700 dark:text-zinc-200">Total Swaps</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{userData?.totalSwaps || 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-3xl shadow-lg border-2 border-pink-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/list-item" className="flex items-center gap-4 p-5 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 transition-all bg-yellow-50 dark:bg-yellow-900/20 shadow-md hover:scale-105">
              <Plus className="text-yellow-500" size={28} />
              <span className="font-semibold text-lg text-yellow-800 dark:text-yellow-200">List New Item</span>
            </Link>
            <Link to="/browse" className="flex items-center gap-4 p-5 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all bg-blue-50 dark:bg-blue-900/20 shadow-md hover:scale-105">
              <Package className="text-blue-500" size={28} />
              <span className="font-semibold text-lg text-blue-800 dark:text-blue-200">Browse Items</span>
            </Link>
          </div>
        </div>

        {/* My Items */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-3xl shadow-lg border-2 border-emerald-200 p-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6 text-center">My Listed Items</h2>
          {userItems.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-300 text-center">You haven't listed any items yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userItems.map((item) => (
                <div
                  key={item._id}
                  className="group border-2 border-pink-100 rounded-2xl overflow-hidden shadow-lg bg-white/90 dark:bg-zinc-800/80 transition-all hover:scale-105 hover:border-emerald-300"
                >
                  <img
                    src={item.images[0] || '/placeholder-image.jpg'}
                    alt={item.title}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-3">{item.condition} • {item.size}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-700 dark:text-yellow-300 font-bold">{item.pointsValue} points</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all
                        ${item.status === 'available'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-700/20 dark:text-emerald-300'
                          : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700/20 dark:text-zinc-300'
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

      {/* Animations & Styles */}
      <style>{`
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob {
          0%, 100% { transform: scale(1) translate(0, 0);}
          33% { transform: scale(1.1, 0.9) translate(30px, -20px);}
          66% { transform: scale(0.9, 1.1) translate(-20px, 30px);}
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
