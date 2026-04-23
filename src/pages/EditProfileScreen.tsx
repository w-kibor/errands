import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const EditProfileScreen = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAppContext();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const optimizeAvatarImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const source = typeof reader.result === 'string' ? reader.result : '';
        if (!source) {
          reject(new Error('read_failed'));
          return;
        }

        const img = new Image();
        img.onload = () => {
          const side = Math.min(img.width, img.height);
          const sx = Math.floor((img.width - side) / 2);
          const sy = Math.floor((img.height - side) / 2);

          const targetSize = 320;
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('canvas_failed'));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, sx, sy, side, side, 0, 0, targetSize, targetSize);

          // Export as compressed jpeg for predictable size across devices.
          const optimized = canvas.toDataURL('image/jpeg', 0.82);
          resolve(optimized);
        };
        img.onerror = () => reject(new Error('image_decode_failed'));
        img.src = source;
      };
      reader.onerror = () => reject(new Error('read_failed'));
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setName(user.name || '');
    setPhone(user.phone?.replace('+254 ', '') || '');
    setAvatar(user.avatar || '');
  }, [user, navigate]);

  if (!user) return null;

  const cleanedName = name.trim();
  const cleanedPhone = phone.replace(/\D/g, '');
  const cleanedAvatar = avatar.trim();

  const isValidName = cleanedName.length >= 2;
  const isValidPhone = cleanedPhone.length >= 9;
  const isValidAvatar = avatarError.length === 0;

  const canSave = isValidName && isValidPhone && isValidAvatar;

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeInBytes = 2 * 1024 * 1024;
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file.');
      return;
    }
    if (file.size > maxSizeInBytes) {
      setAvatarError('Image is too large. Please use an image under 2MB.');
      return;
    }

    setIsProcessingAvatar(true);
    try {
      const optimizedImage = await optimizeAvatarImage(file);
      setAvatar(optimizedImage);
      setAvatarError('');
    } catch {
      setAvatarError('Could not read this image. Try a different file.');
    } finally {
      setIsProcessingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!canSave) return;

    try {
      await updateUserProfile({
        name: cleanedName,
        phone: `+254 ${cleanedPhone}`,
        avatar: cleanedAvatar || undefined
      });

      navigate('/profile');
    } catch {
      window.alert('Could not save profile changes. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-gray-50"
    >
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm flex items-center z-10">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 -ml-2 bg-gray-50 rounded-full"
        >
          <ArrowLeft size={20} className="text-dark" />
        </button>
        <h1 className="text-lg font-bold text-dark ml-4">Edit Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-28 no-scrollbar">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-base font-bold text-dark">Update Your Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Keep your profile up to date for deliveries and support.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand"
          />
          {!isValidName && name.length > 0 && (
            <p className="text-xs text-red-500">Name must be at least 2 characters.</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark">Phone Number</label>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-brand">
            <div className="px-4 py-3 bg-gray-50 text-sm font-medium text-dark border-r border-gray-200">
              +254
            </div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="712345678"
              className="flex-1 px-4 py-3 text-sm outline-none"
            />
          </div>
          {!isValidPhone && phone.length > 0 && (
            <p className="text-xs text-red-500">Phone number must be at least 9 digits.</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-dark">Profile Picture</label>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={avatar || 'https://via.placeholder.com/150'}
                alt="Avatar preview"
                className="w-14 h-14 rounded-full object-cover border-2 border-brand/20"
              />
              <div className="ml-3">
                <p className="text-sm font-semibold text-dark">Upload from device</p>
                <p className="text-xs text-gray-500">Auto-cropped and compressed</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePickAvatar}
              disabled={isProcessingAvatar}
              className="inline-flex items-center px-3 py-2 rounded-lg bg-brand/15 text-dark text-sm font-semibold"
            >
              <Camera size={16} className="mr-1.5" />
              {isProcessingAvatar ? 'Processing...' : 'Change'}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
          {avatarError && <p className="text-xs text-red-500">{avatarError}</p>}
        </div>
      </div>

      <div className="bg-white border-t border-gray-100 p-4 pb-safe absolute bottom-0 left-0 right-0 shadow-up z-20">
        <button
          onClick={handleSave}
          disabled={!canSave || isProcessingAvatar}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
            canSave
              ? 'bg-brand text-dark shadow-md active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};
