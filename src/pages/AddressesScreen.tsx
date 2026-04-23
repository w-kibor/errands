import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Plus, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const AddressesScreen = () => {
  const navigate = useNavigate();
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setPrimaryAddress
  } = useAppContext();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [setAsMain, setSetAsMain] = useState(false);

  const canSave = label.trim().length >= 2 && address.trim().length >= 5;

  const resetForm = () => {
    setLabel('');
    setAddress('');
    setSetAsMain(false);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleAddAddress = () => {
    if (!canSave) return;

    if (editingId) {
      updateAddress({
        id: editingId,
        label: label.trim(),
        address: address.trim(),
        isPrimary: setAsMain
      });
    } else {
      addAddress({
        label: label.trim(),
        address: address.trim(),
        isPrimary: setAsMain
      });
    }

    resetForm();
  };

  const handleStartAdd = () => {
    if (isAdding) {
      resetForm();
      return;
    }
    setIsAdding(true);
  };

  const handleEditAddress = (addressId: string) => {
    const target = addresses.find((item) => item.id === addressId);
    if (!target) return;
    setEditingId(target.id);
    setLabel(target.label);
    setAddress(target.address);
    setSetAsMain(target.isPrimary);
    setIsAdding(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (addresses.length === 1) {
      window.alert('You need at least one saved address.');
      return;
    }

    const shouldDelete = window.confirm('Delete this address?');
    if (!shouldDelete) return;

    deleteAddress(addressId);
    if (editingId === addressId) {
      resetForm();
    }
  };

  const handleSetMain = (addressId: string) => {
    const shouldSet = window.confirm('Set this as your main address?');
    if (!shouldSet) return;
    setPrimaryAddress(addressId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-gray-50"
    >
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 -ml-2 bg-gray-50 rounded-full"
          >
            <ArrowLeft size={20} className="text-dark" />
          </button>
          <h1 className="text-lg font-bold text-dark ml-4">My Addresses</h1>
        </div>

        <button
          onClick={handleStartAdd}
          className="inline-flex items-center bg-brand/15 text-dark text-sm font-semibold px-3 py-2 rounded-lg"
        >
          <Plus size={16} className="mr-1" />
          {isAdding ? 'Close' : 'Add'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24 no-scrollbar">
        {isAdding && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <h2 className="font-bold text-dark">{editingId ? 'Edit Address' : 'Add New Address'}</h2>

            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label (Home, Work, Office)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand"
            />

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter full address"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand resize-none h-24"
            />

            <label className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
              <span className="text-sm font-medium text-dark">Set as main address</span>
              <input
                type="checkbox"
                checked={setAsMain}
                onChange={(e) => setSetAsMain(e.target.checked)}
                className="w-4 h-4 accent-brand"
              />
            </label>

            <button
              onClick={handleAddAddress}
              disabled={!canSave}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                canSave
                  ? 'bg-brand text-dark active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        )}

        {addresses.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <MapPin size={36} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-dark">No addresses yet</h3>
            <p className="text-sm text-gray-500 mt-1">Add an address to speed up checkout and deliveries.</p>
          </div>
        )}

        {addresses.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-dark">{item.label}</span>
                  {item.isPrimary && (
                    <span className="inline-flex items-center bg-green-50 text-green-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} className="mr-1" />
                      Main Address
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{item.address}</p>
              </div>
              {!item.isPrimary && (
                <button
                  onClick={() => handleSetMain(item.id)}
                  className="text-xs font-semibold text-brand-dark bg-brand/10 px-3 py-1.5 rounded-lg whitespace-nowrap"
                >
                  Set as Main
                </button>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
              <button
                onClick={() => handleEditAddress(item.id)}
                className="inline-flex items-center text-xs font-semibold text-dark bg-gray-100 px-3 py-1.5 rounded-lg"
              >
                <Pencil size={12} className="mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteAddress(item.id)}
                className="inline-flex items-center text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg"
              >
                <Trash2 size={12} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
