import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, CheckCircle2, Trash2, CreditCard } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { PaymentMethodType } from '../types';

export const PaymentMethodsScreen = () => {
  const navigate = useNavigate();
  const {
    paymentMethods,
    addPaymentMethod,
    setDefaultPaymentMethod,
    deletePaymentMethod
  } = useAppContext();

  const [isAdding, setIsAdding] = useState(false);
  const [type, setType] = useState<PaymentMethodType>('M-Pesa');
  const [label, setLabel] = useState('');
  const [details, setDetails] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);

  const canSave = label.trim().length >= 2 && details.trim().length >= 3;

  const handleAdd = () => {
    if (!canSave) return;

    addPaymentMethod({
      type,
      label: label.trim(),
      details: details.trim(),
      isDefault: setAsDefault
    });

    setLabel('');
    setDetails('');
    setSetAsDefault(false);
    setType('M-Pesa');
    setIsAdding(false);
  };

  const handleSetDefault = (id: string) => {
    const shouldSet = window.confirm('Set this as your default payment method?');
    if (!shouldSet) return;
    setDefaultPaymentMethod(id);
  };

  const handleDelete = (id: string) => {
    if (paymentMethods.length === 1) {
      window.alert('You need at least one payment method.');
      return;
    }
    const shouldDelete = window.confirm('Delete this payment method?');
    if (!shouldDelete) return;
    deletePaymentMethod(id);
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
          <h1 className="text-lg font-bold text-dark ml-4">Payment Methods</h1>
        </div>

        <button
          onClick={() => setIsAdding((prev) => !prev)}
          className="inline-flex items-center bg-brand/15 text-dark text-sm font-semibold px-3 py-2 rounded-lg"
        >
          <Plus size={16} className="mr-1" />
          {isAdding ? 'Close' : 'Add'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24 no-scrollbar">
        {isAdding && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <h2 className="font-bold text-dark">Add Payment Method</h2>

            <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
              {(['M-Pesa', 'Card', 'Cash on Delivery'] as PaymentMethodType[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setType(item)}
                  className={`py-2 rounded-lg text-xs font-semibold ${
                    type === item ? 'bg-white text-dark shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label (Personal, Work, Office)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand"
            />

            <input
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={type === 'M-Pesa' ? 'e.g. *** *** 678' : type === 'Card' ? 'e.g. **** **** **** 1234' : 'Pay with cash at delivery'}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand"
            />

            <label className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
              <span className="text-sm font-medium text-dark">Set as default</span>
              <input
                type="checkbox"
                checked={setAsDefault}
                onChange={(e) => setSetAsDefault(e.target.checked)}
                className="w-4 h-4 accent-brand"
              />
            </label>

            <button
              onClick={handleAdd}
              disabled={!canSave}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                canSave ? 'bg-brand text-dark active:scale-[0.98]' : 'bg-gray-100 text-gray-400'
              }`}
            >
              Save Payment Method
            </button>
          </div>
        )}

        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-dark">{method.label}</span>
                  {method.isDefault && (
                    <span className="inline-flex items-center bg-green-50 text-green-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} className="mr-1" />
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{method.type}</p>
                <p className="text-sm text-gray-500 mt-1">{method.details}</p>
              </div>
              {!method.isDefault && (
                <button
                  onClick={() => handleSetDefault(method.id)}
                  className="text-xs font-semibold text-brand-dark bg-brand/10 px-3 py-1.5 rounded-lg whitespace-nowrap"
                >
                  Set Default
                </button>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
              <button
                onClick={() => handleDelete(method.id)}
                className="inline-flex items-center text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg"
              >
                <Trash2 size={12} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {paymentMethods.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <CreditCard size={36} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-dark">No payment methods yet</h3>
            <p className="text-sm text-gray-500 mt-1">Add a method to complete payments faster.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
