import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Package, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const MySwaps = () => {
  const { user } = useUser();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace with actual API call
  useEffect(() => {
    if (!user) return;
    // Simulate API call
    setTimeout(() => {
      setSwaps([
        {
          _id: 'swap1',
          itemTitle: 'Vintage Denim Jacket',
          itemImage: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400',
          status: 'completed',
          partner: 'summergirl',
          date: '2024-06-01',
          points: 150,
        },
        {
          _id: 'swap2',
          itemTitle: 'Designer Sneakers',
          itemImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
          status: 'pending',
          partner: 'sneakerhead',
          date: '2024-06-10',
          points: 200,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [user]);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Swaps</h1>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-600"></div>
          </div>
        ) : swaps.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <Package size={48} className="mx-auto mb-4 text-yellow-400" />
            <p className="text-lg">You haven't participated in any swaps yet.</p>
            <p className="mt-2">Start swapping to see your activity here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {swaps.map((swap) => (
              <div key={swap._id} className="bg-white rounded-lg shadow p-6 flex items-center gap-6">
                <img
                  src={swap.itemImage}
                  alt={swap.itemTitle}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{swap.itemTitle}</h2>
                  <div className="text-gray-600 text-sm mb-2">
                    With <span className="font-semibold">{swap.partner}</span> &middot; {new Date(swap.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-600 font-semibold">{swap.points} pts</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      swap.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {swap.status === 'completed' ? (
                        <>
                          <CheckCircle size={14} /> Completed
                        </>
                      ) : (
                        <>
                          <Clock size={14} /> Pending
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <ArrowRight size={28} className="text-gray-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySwaps;