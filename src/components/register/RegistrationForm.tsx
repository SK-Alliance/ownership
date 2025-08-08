'use client';

import React, { useState } from 'react';
import { useItemRegistration } from '@/hooks/useItemRegistration';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { RegisterItemRequest } from '@/types/api';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function RegistrationForm() {
  const [formData, setFormData] = useState<RegisterItemRequest>({
    title: '',
    category: '',
    est_value: 0,
    billFile: undefined,
    idFile: undefined,
  });

  const { isLoading, error, success, registerItem, reset } = useItemRegistration();
  const { isAuthenticated } = useWalletConnection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      return;
    }

    const result = await registerItem(formData);
    if (result?.success) {
      // Reset form on success
      setFormData({
        title: '',
        category: '',
        est_value: 0,
        billFile: undefined,
        idFile: undefined,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'billFile' | 'idFile') => {
    const file = e.target.files?.[0];
    setFormData(prev => ({ ...prev, [type]: file }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Register New Item</h1>
          
          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-center">
              <p className="mb-4">Connect your wallet to register items</p>
              <ConnectButton />
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Item registered successfully! It has been submitted for verification.
              <button
                onClick={reset}
                className="ml-2 text-green-800 underline"
              >
                Register another item
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
              <button
                onClick={reset}
                className="ml-2 text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., iPhone 14 Pro"
                required
                disabled={!isAuthenticated}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                disabled={!isAuthenticated}
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="vehicles">Vehicles</option>
                <option value="jewelry">Jewelry</option>
                <option value="art">Art & Collectibles</option>
                <option value="real_estate">Real Estate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Value (USD) *
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={formData.est_value || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  est_value: parseFloat(e.target.value) || 0 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1000.00"
                required
                disabled={!isAuthenticated}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill/Receipt (optional)
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'billFile')}
                accept="image/*,.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!isAuthenticated}
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload proof of purchase (JPG, PNG, PDF - Max 10MB)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Document (optional)
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'idFile')}
                accept="image/*,.pdf"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!isAuthenticated}
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload government ID for verification (JPG, PNG, PDF - Max 10MB)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isAuthenticated || !formData.title || !formData.category || !formData.est_value}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Registering...' : 'Register Item'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Fill out the item details</li>
              <li>2. Upload supporting documents (optional but recommended)</li>
              <li>3. Submit for verification</li>
              <li>4. Earn 100 XP once verified</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
