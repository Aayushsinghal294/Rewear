import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { itemAPI } from '../services/api';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    itemAPI.getItemById(id)
      .then(res => setItem(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!item) return <div className="text-center py-10 text-red-500">Item not found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={item.images?.[0] || '/placeholder.jpg'}
          alt={item.title}
          className="w-full md:w-80 h-80 object-cover rounded-lg shadow"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2 text-yellow-700">{item.title}</h2>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="mb-2">
            <span className="font-semibold">Category:</span> {item.category}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Size:</span> {item.size}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Condition:</span> {item.condition}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Tags:</span> {item.tags?.join(', ')}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Uploader:</span> {item.uploaderName || 'Unknown'}
          </div>
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-2 bg-yellow-500 text-white rounded-full shadow hover:bg-yellow-600 transition">Swap Request</button>
            <button className="px-6 py-2 bg-yellow-100 text-yellow-700 border border-yellow-400 rounded-full shadow hover:bg-yellow-200 transition">Redeem via Points</button>
          </div>
          <div className="mt-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {item.available ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>
      </div>
      {/* Image gallery (if multiple images) */}
      {item.images?.length > 1 && (
        <div className="flex gap-2 mt-6">
          {item.images.map((img, idx) => (
            <img key={idx} src={img} alt={`item-${idx}`} className="w-20 h-20 object-cover rounded border" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemDetail;