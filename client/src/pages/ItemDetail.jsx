import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { itemAPI } from '../services/api';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    itemAPI.getItemById(id)
      .then(res => setItem(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#FFFDF4] via-[#FFF5D1] to-[#FFF9E9]">
        <span className="loading loading-spinner loading-lg text-yellow-500"></span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center mt-12 text-gray-400 text-lg">
        Item not found or an error occurred.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FFFDF4] via-[#FFF5D1] to-[#FFF9E9] pb-12 pt-20">
      {/* Floating Blobs for Depth */}
      <div className="pointer-events-none absolute -top-28 -left-28 w-80 h-80 bg-yellow-200 opacity-20 rounded-full blur-3xl animate-blob"></div>
      <div className="pointer-events-none absolute -bottom-28 -right-28 w-80 h-80 bg-amber-200 opacity-20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

      <div className="max-w-5xl mx-auto p-4 md:p-10 z-10 relative">
        <div className="grid md:grid-cols-2 gap-12 bg-gradient-to-br from-yellow-100 via-emerald-50 to-amber-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-emerald-950 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-yellow-200 dark:border-emerald-900 p-6 md:p-12 transition-all duration-300">
          {/* Image Gallery */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-yellow-300 dark:border-emerald-800 bg-white/95 dark:bg-zinc-900/90">
              <img
                src={item.images?.[0] || '/placeholder.jpg'}
                alt={item.title}
                className="w-full h-80 md:h-96 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            {item.images?.length > 1 && (
              <div className="flex gap-3">
                {item.images.slice(1, 4).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`alt-${idx}`}
                    className="w-16 h-16 object-cover rounded-lg border border-yellow-100 shadow"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-extrabold mb-2 text-yellow-800 dark:text-yellow-200 tracking-tight">{item.title}</h1>
              <p className="text-lg text-zinc-700 dark:text-zinc-200 mb-6">{item.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="px-4 py-2 rounded-xl bg-yellow-200 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-200 font-semibold text-sm shadow">
                  Category: <span className="font-bold">{item.category}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-semibold text-sm shadow">
                  Size: <span className="font-bold">{item.size}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-200 font-semibold text-sm shadow">
                  Condition: <span className="font-bold">{item.condition}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200 font-semibold text-sm shadow">
                  Points: <span className="font-bold">{item.pointsValue}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 font-semibold text-sm shadow">
                  Views: <span className="font-bold">{item.views ?? 0}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200 font-semibold text-sm shadow">
                  Likes: <span className="font-bold">{item.likes?.length ?? 0}</span>
                </div>
              </div>

              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold shadow">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Owner Card */}
            <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-100 via-orange-50 to-emerald-100 dark:from-zinc-800 dark:via-zinc-900 dark:to-emerald-950 shadow-lg border border-yellow-200 dark:border-emerald-700">
              <img
                src={item.owner?.profileImage || '/avatar.png'}
                alt={item.owner?.username || 'User'}
                className="w-14 h-14 rounded-full border-2 border-emerald-300 shadow"
              />
              <div>
                <div className="font-bold text-lg text-yellow-800 dark:text-yellow-200">{item.owner?.username || 'User'}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-300">Rating: <span className="font-semibold">{item.owner?.rating || '5.0'}</span></div>
              </div>
            </div>
          </div>
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

export default ItemDetails;
