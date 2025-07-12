import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Package, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const MySwaps = () => {
  const { user } = useUser();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/swaps/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setSwaps(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
                  src={swap.itemImage || (swap.item && swap.item.images && swap.item.images[0]) || '/placeholder.jpg'}
                  alt={swap.itemTitle || (swap.item && swap.item.title) || 'Item'}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{swap.itemTitle || (swap.item && swap.item.title)}</h2>
                  <div className="text-gray-600 text-sm mb-2">
                    With <span className="font-semibold">{swap.partner || swap.requester || swap.itemOwner}</span> &middot; {new Date(swap.date || swap.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-600 font-semibold">{swap.points || swap.pointsValue || 0} pts</span>
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