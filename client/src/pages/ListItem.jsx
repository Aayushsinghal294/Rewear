import React, { useState } from 'react';
import { Upload, X, Plus, AlertCircle, Check } from 'lucide-react';
import { itemAPI } from '../services/api';
import { useUser } from '@clerk/clerk-react';

const CLOUDINARY_UPLOAD_PRESET = 'clothList'; // <-- Replace with your unsigned preset name
const CLOUDINARY_CLOUD_NAME = 'dora42wml'; // <-- Your Cloudinary cloud name

const ListItem = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    type: '',
    brand: '',
    color: '',
    pointsValue: '',
    tags: []
  });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'activewear', label: 'Activewear' }
  ];

  const sizes = [
    { value: '', label: 'Select Size' },
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
    { value: '12', label: '12' },
    { value: 'One Size', label: 'One Size' }
  ];

  const conditions = [
    { value: '', label: 'Select Condition' },
    { value: 'New', label: 'New' },
    { value: 'Like New', label: 'Like New' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024;
      return isValid;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          name: file.name
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.type.trim()) newErrors.type = 'Type is required';
    if (!formData.pointsValue) newErrors.pointsValue = 'Points value is required';
    else if (formData.pointsValue < 1 || formData.pointsValue > 1000) {
      newErrors.pointsValue = 'Points value must be between 1 and 1000';
    }
    if (images.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // CLOUDINARY UPLOAD FUNCTION
  const uploadToCloudinary = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(url, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!data.secure_url) throw new Error('Cloudinary upload failed');
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Upload all images to Cloudinary and get URLs
      const imageUrls = [];
      for (const img of images) {
        const url = await uploadToCloudinary(img.file);
        imageUrls.push(url);
      }
      const itemData = {
        ...formData,
        images: imageUrls,
        owner: user?.id || "unknown"
      };
      await itemAPI.createItem(itemData);
      setSuccess(true);
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          category: '',
          size: '',
          condition: '',
          type: '',
          brand: '',
          color: '',
          pointsValue: '',
          tags: []
        });
        setImages([]);
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting item:', error);
      setErrors({ submit: error.message || 'Failed to list item. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Listed Successfully!</h2>
          <p className="text-gray-600 mb-6">Your item has been added to the marketplace and is now available for swapping.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            List Another Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">List New Item</h1>
          <p className="text-gray-600 mt-2">Share your pre-loved fashion items with the community</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Upload */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos</h2>
            <p className="text-sm text-gray-600 mb-4">Add up to 5 photos. The first photo will be your cover image.</p>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragActive ? 'border-yellow-600 bg-yellow-50' : 'border-gray-300 bg-gray-50'}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <Upload size={32} className="text-yellow-600 mb-2" />
              <span className="text-gray-700 font-medium mb-2">Drag & drop images here, or click to select</span>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                disabled={images.length >= 5}
              />
              <span className="text-xs text-gray-500">{images.length}/5 images selected</span>
              {errors.images && <div className="text-red-500 text-xs mt-2">{errors.images}</div>}
            </div>
            {/* Preview Images */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {images.map(img => (
                  <div key={img.id} className="relative w-24 h-24">
                    <img src={img.preview} alt={img.name} className="w-full h-full object-cover rounded-lg border" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100"
                      onClick={() => removeImage(img.id)}
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-yellow-500`}
                  placeholder="e.g. Vintage Denim Jacket"
                />
                {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-yellow-500`}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${errors.size ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-yellow-500`}
                >
                  {sizes.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
                {errors.size && <div className="text-red-500 text-xs mt-1">{errors.size}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${errors.condition ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-yellow-500`}
                >
                  {conditions.map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
                {errors.condition && <div className="text-red-500 text-xs mt-1">{errors.condition}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${errors.type ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-yellow-500`}
                  placeholder="e.g. Jacket, Dress, Shoes"
                />
                {errors.type && <div className="text-red-500 text-xs mt-1">{errors.type}</div>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand (optional)</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g. Levi's"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color (optional)</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g. Blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points Value</label>
                <input
                  type="number"
                  name="pointsValue"
                  value={formData.pointsValue}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg ${errors.pointsValue ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-yellow-500`}
                  placeholder="e.g. 100"
                  min={1}
                  max={1000}
                />
                {errors.pointsValue && <div className="text-red-500 text-xs mt-1">{errors.pointsValue}</div>}
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-yellow-500`}
                rows={4}
                placeholder="Describe your item, its story, and any flaws or highlights"
              />
              {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
            </div>
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (optional)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g. vintage, summer"
                  onKeyDown={e => e.key === 'Enter' ? (e.preventDefault(), addTag()) : null}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Listing Item...' : 'List Item'}
              </button>
              {errors.submit && (
                <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                 <AlertCircle size={16} /> {errors.submit}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListItem;