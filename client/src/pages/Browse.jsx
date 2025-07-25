import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Eye, Star, X, ChevronDown } from 'lucide-react';
import { itemAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
const Browse = () => {
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [selectedSwapItem, setSelectedSwapItem] = useState(null);
    const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: '',
    size: '',
    condition: '',
    minPoints: '',
    maxPoints: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user || !showSwapModal) return;

      try {
        const response = await fetch(`http://localhost:5000/api/items/user/${user.id}`);
        const data = await response.json();
        setUserListings(data);
      } catch (error) {
        console.error("Failed to fetch user listings:", error);
      }
    };

    fetchUserListings();
  }, [user, showSwapModal]);
  useEffect(() => {
    setLoading(true);
    itemAPI.getAllItems({ ...filters, sortBy, sortOrder, page: currentPage })
      .then(res => {
        setItems(res.data.items);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [filters, sortBy, sortOrder, currentPage]);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'activewear', label: 'Activewear' }
  ];

  const sizes = [
    { value: '', label: 'All Sizes' },
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' }
  ];

  const conditions = [
    { value: '', label: 'All Conditions' },
    { value: 'New', label: 'New' },
    { value: 'Like New', label: 'Like New' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  const handleSwapClick = (item) => {
    setSelectedItem(item);
    setShowSwapModal(true);
  };
  const handleSubmitSwapRequest = async () => {
    if (!selectedSwapItem) {
      alert("Please select an item to swap.");
      return;
    }

    try {
      const response = await fetch("/api/swaps/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetItemId: selectedItem._id,       // The item you're trying to get
          offeredItemId: selectedSwapItem._id,  // Your item you're offering
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send swap request");
      }

      toast.success("Swap request sent!");
      // setIsSwapModalOpen(false); // Close modal if using one
      setSelectedSwapItem(null); // Reset selection
    } catch (err) {
      console.error("Swap request error:", err);
      toast.error(err.message || "Something went wrong.");
    }
  };


  const clearFilters = () => {
    setFilters({
      category: '',
      size: '',
      condition: '',
      minPoints: '',
      maxPoints: '',
      search: ''
    });
  };
  const handleSelectSwapItem = (myItem) => {
    // For now, just log what was selected — sending the request is the next step
    setSelectedSwapItem(myItem);
    console.log("Proposing swap:", {
      yourItem: myItem,
      targetItem: selectedItem,
    });
  };

  const [likedItems, setLikedItems] = useState([]);

  const handleLikeClick = (itemId) => {
    setLikedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
    // Optionally, send like/unlike to backend here
  };

  const ItemCard = ({ item }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="relative">
      <img
        src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder.jpg'}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
        <Heart
          size={16}
          className={`${likedItems.includes(item._id) ? 'text-red-500 fill-current' : 'text-gray-400'} cursor-pointer`}
          onClick={() => handleLikeClick(item._id)}
        />
      </div>
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        {item.condition}
      </div>
    </div>

    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
          {item.category}
        </span>
        <span className="text-xs text-gray-500">Size {item.size}</span>
      </div>

      <h3 className="font-semibold text-gray-800 mb-2 truncate">{item.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{item.owner && item.owner.username ? item.owner.username : 'Aayush'}</span>
          <div className="flex items-center">
            <Star size={12} className="text-yellow-500 fill-current" />
            <span className="text-xs text-gray-500 ml-1">{item.owner && item.owner.rating ? item.owner.rating : '5.0'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye size={12} />
            <span>{item.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart size={12} />
            <span>{item.likes.length}</span>
          </div>
        </div>
        <div className="text-lg font-bold text-yellow-600">
          {item.pointsValue} pts
        </div>
      </div>

      <div className="flex space-x-2">
        <Link
          to={`/item/${item._id}`}
          className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors text-center"
        >
          View Details
        </Link>
        <button
          onClick={() => handleSwapClick(item)}
          className="px-4 py-2 border border-yellow-600 text-yellow-600 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors"
        >
          Swap
        </button>
        <button
          onClick={() =>navigate(`/item/${item._id}`)}
          className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
        >
          Redeem
        </button>
      </div>
    </div>
  </div>
);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Browse Items</h1>
          <p className="text-gray-600 mt-2">Discover amazing pre-loved fashion items</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={20} />
              Filters
              <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={filters.size}
                    onChange={(e) => handleFilterChange('size', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    {sizes.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    {conditions.map(condition => (
                      <option key={condition.value} value={condition.value}>{condition.label}</option>
                    ))}
                  </select>
                </div>

                {/* Points Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Points</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPoints}
                    onChange={(e) => handleFilterChange('minPoints', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Points</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPoints}
                    onChange={(e) => handleFilterChange('maxPoints', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-gray-600 mr-2">Sort by:</span>
            <button
              onClick={() => handleSortChange('createdAt')}
              className={`px-3 py-1 rounded-full text-sm ${sortBy === 'createdAt'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Latest {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSortChange('pointsValue')}
              className={`px-3 py-1 rounded-full text-sm ${sortBy === 'pointsValue'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Points {sortBy === 'pointsValue' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSortChange('views')}
              className={`px-3 py-1 rounded-full text-sm ${sortBy === 'views'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Popular {sortBy === 'views' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {items.map(item => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  disabled={!pagination.hasPrev}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  disabled={!pagination.hasNext}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      {showSwapModal && selectedItem && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gradient-to-br from-yellow-50 to-teal-50 rounded-2xl shadow-2xl max-w-md w-full p-8 relative border-2 border-yellow-200">
      <button
        onClick={() => setShowSwapModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-yellow-600 transition-colors"
      >
        <X size={24} />
      </button>
      <h2 className="text-2xl font-bold mb-2 text-yellow-700 text-center">Propose a Swap</h2>
      <p className="text-sm text-gray-600 mb-4 text-center">
        You are proposing a swap for: <strong className="text-yellow-700">{selectedItem.title}</strong>
      </p>
      {userListings.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">You have no listings available for swap.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto px-2 mb-4">
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className={`bg-white border-2 rounded-xl p-2 shadow-sm transition duration-200 cursor-pointer flex flex-col items-center
                ${selectedSwapItem?._id === listing._id ? 'border-yellow-500 ring-2 ring-yellow-300' : 'hover:bg-yellow-50 border-gray-200'}`}
              onClick={() => handleSelectSwapItem(listing)}
            >
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-24 object-cover rounded-md mb-2"
              />
              <p className="text-xs font-semibold text-center">{listing.title}</p>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => navigate('/')}
        disabled={!selectedSwapItem}
        className={`mt-4 w-full py-3 rounded-lg font-bold transition-colors text-lg
          ${selectedSwapItem
            ? 'bg-yellow-600 text-white hover:bg-yellow-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
      >
        Send Swap Request
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Browse;