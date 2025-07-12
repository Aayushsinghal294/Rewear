import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { userAPI } from '../services/api';
import { Upload, User, MapPin, Camera, Save, AlertCircle, CheckCircle } from 'lucide-react';

const CLOUDINARY_UPLOAD_PRESET = 'clothList'; // Your Cloudinary preset
const CLOUDINARY_CLOUD_NAME = 'dora42wml';    // Your Cloudinary cloud name

const ProfileUpdateForm = ({ onUpdated }) => {
  const { user } = useUser();
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  

  // Upload image to Cloudinary and return the URL
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setMessageType('');
    try {
      let imageUrl = '';
      if (profileImage) {
        imageUrl = await uploadToCloudinary(profileImage);
      }
      await userAPI.updateProfile(user.id, {
        bio,
        location,
        username,
        firstName,
        lastName,
        profileImage: imageUrl || undefined
      });
      setMessage('Profile updated successfully!');
      setMessageType('success');
      if (onUpdated) onUpdated();
    } catch (err) {
      setMessage('Failed to update profile. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-teal-50 py-12 px-4 mt-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-teal-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <User size={32} />
              Update Your Profile
            </h2>
            <p className="text-yellow-100 mt-2">
              Keep your profile fresh and let others know who you are
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate}>
            <div className="p-8 space-y-6">
              {/* Profile Image Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-100 to-teal-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="text-yellow-600" size={48} />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-yellow-600 text-white p-2 rounded-full cursor-pointer hover:bg-yellow-700 transition-colors shadow-lg">
                    <Upload size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Click the upload icon to change your profile picture
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                  placeholder="Choose a unique username"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
                  placeholder="City, State or Country"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about yourself, your style, and what you're looking for..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {bio.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-yellow-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Update Profile
                    </>
                  )}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  messageType === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {messageType === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  {message}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              A clear profile picture helps build trust with other users
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              Include your location to find local swap opportunities
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              Write a bio that reflects your personal style and preferences
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              Keep your username simple and memorable
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdateForm;