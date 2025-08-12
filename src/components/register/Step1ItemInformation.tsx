'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Tag, 
  Building, 
  Hash, 
  DollarSign,
  ArrowRight,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface Step1Props {
  formData: {
    title: string;
    category: string;
    brand: string;
    serialNumber: string;
    est_value: number;
  };
  imagePreview: string | null;
  onFormDataChange: (data: any) => void;
  onImageChange: (file: File) => void;
  onNext: () => void;
  isValid: boolean;
}

export const Step1ItemInformation: React.FC<Step1Props> = ({
  formData,
  imagePreview,
  onFormDataChange,
  onImageChange,
  onNext,
  isValid
}) => {
  const handleInputChange = (field: string, value: string | number) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleUploadClick = () => {
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30">
          <Package className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-2xl font-bold text-main mb-2">Item Information</h2>
        <p className="text-muted">Enter the basic details about your item</p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item Image */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-main mb-3">
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Item Image *
          </label>
          
          {/* Upload Button */}
          <div className="mb-4">
            <Button
              type="button"
              onClick={handleUploadClick}
              variant="outline"
              className="px-6 py-3 border-2 border-dashed border-gold/30 bg-gold/5 text-gold hover:border-gold/50 hover:bg-gold/10 transition-all duration-200"
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose Image File
            </Button>
            <p className="text-xs text-muted mt-2">PNG, JPG up to 10MB</p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative rounded-lg border border-main/20 bg-main/5 p-4">
              <img
                src={imagePreview}
                alt="Item preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Hidden File Input */}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            required
          />
        </div>

        {/* Item Title */}
        <div>
          <label className="block text-sm font-medium text-main mb-2">
            <Tag className="w-4 h-4 inline mr-2" />
            Item Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-main/5 border border-main/20 text-main placeholder-muted focus:outline-none focus:border-gold/50 focus:bg-main/10 transition-all"
            placeholder="e.g., iPhone 15 Pro Max"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-main mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-main/5 border border-main/20 text-main focus:outline-none focus:border-gold/50 focus:bg-main/10 transition-all"
            required
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="vehicles">Vehicles</option>
            <option value="jewelry">Jewelry</option>
            <option value="art">Art</option>
            <option value="real_estate">Real Estate</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-main mb-2">
            <Building className="w-4 h-4 inline mr-2" />
            Brand *
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => handleInputChange('brand', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-main/5 border border-main/20 text-main placeholder-muted focus:outline-none focus:border-gold/50 focus:bg-main/10 transition-all"
            placeholder="e.g., Apple"
            required
          />
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-main mb-2">
            <Hash className="w-4 h-4 inline mr-2" />
            Serial Number *
          </label>
          <input
            type="text"
            value={formData.serialNumber}
            onChange={(e) => handleInputChange('serialNumber', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-main/5 border border-main/20 text-main placeholder-muted focus:outline-none focus:border-gold/50 focus:bg-main/10 transition-all"
            placeholder="e.g., SN123456789"
            required
          />
        </div>

        {/* Estimated Value */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-main mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Estimated Value (USD) *
          </label>
          <input
            type="number"
            value={formData.est_value || ''}
            onChange={(e) => handleInputChange('est_value', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 rounded-lg bg-main/5 border border-main/20 text-main placeholder-muted focus:outline-none focus:border-gold/50 focus:bg-main/10 transition-all"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-6 border-t border-main/10">
        <Button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="px-8 py-3 bg-gradient-to-r from-gold to-gold/80 text-bg-main font-medium rounded-lg hover:shadow-lg hover:shadow-gold/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to NFT Preview
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
