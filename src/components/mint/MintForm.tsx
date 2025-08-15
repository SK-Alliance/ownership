'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Eye } from 'lucide-react';

export interface MintFormData {
  itemName: string;
  model: string;
  manufacturer: string;
  category: string;
  estimatedValue: number;
  description: string;
  image: File | null;
}

interface MintFormProps {
  onSubmit: (data: MintFormData) => void;
  onPreview: (data: MintFormData) => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  'Electronics',
  'Jewelry',
  'Art',
  'Collectibles',
  'Fashion',
  'Home & Garden',
  'Sports & Recreation',
  'Tools & Equipment',
  'Books & Media',
  'Other'
];

export const MintForm: React.FC<MintFormProps> = ({
  onSubmit,
  onPreview,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<MintFormData>({
    itemName: '',
    model: '',
    manufacturer: '',
    category: '',
    estimatedValue: 0,
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (field: keyof MintFormData, value: string | number | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert('File size exceeds 10MB limit. Please choose a smaller file.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      handleInputChange('image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = () => {
    return (
      formData.itemName.trim() !== '' &&
      formData.model.trim() !== '' &&
      formData.manufacturer.trim() !== '' &&
      formData.category !== '' &&
      formData.estimatedValue > 0 &&
      formData.description.trim() !== '' &&
      formData.image !== null
    );
  };

  const handlePreview = () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields and upload an image.');
      return;
    }
    
    onPreview(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill in all required fields and upload an image.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/50 border-main/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-main text-center">
          Mint Your Item as NFT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="text-main font-medium">
              Item Image *
            </Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-main/20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 text-green bg-green border-green/30 backdrop-blur-sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-main/30 rounded-lg cursor-pointer hover:border-main/50 transition-colors"
                >
                  <Upload className="w-12 h-12 text-main/50 mb-4" />
                  <span className="text-main font-medium">Click to upload image</span>
                  <span className="text-muted text-sm">PNG, JPG up to 10MB</span>
                </label>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required
              />
            </div>
          </div>

          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="itemName" className="text-main font-medium">
              Item Name *
            </Label>
            <Input
              id="itemName"
              type="text"
              value={formData.itemName}
              onChange={(e) => handleInputChange('itemName', e.target.value)}
              placeholder="Enter the name of your item"
              required
              className="bg-card border-main/20 text-main"
            />
          </div>

          {/* Model and Manufacturer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model" className="text-main font-medium">
                Model *
              </Label>
              <Input
                id="model"
                type="text"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Enter model number/name"
                required
                className="bg-card border-main/20 text-main"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer" className="text-main font-medium">
                Manufacturer/Creator *
              </Label>
              <Input
                id="manufacturer"
                type="text"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                placeholder="Enter manufacturer name"
                required
                className="bg-card border-main/20 text-main"
              />
            </div>
          </div>

          {/* Category and Estimated Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-main font-medium">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                required
              >
                <SelectTrigger className="bg-card border-main/20 text-main">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-main/20">
                  {CATEGORIES.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="text-main hover:bg-gold hover:text-bg-main focus:bg-gold focus:text-bg-main"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedValue" className="text-main font-medium">
                Estimated Value (USD) *
              </Label>
              <Input
                id="estimatedValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.estimatedValue || ''}
                onChange={(e) => handleInputChange('estimatedValue', parseFloat(e.target.value) || 0)}
                placeholder="Enter estimated value"
                required
                className="bg-card border-main/20 text-main"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-main font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your item, its condition, unique features, etc."
              rows={4}
              required
              className="bg-card border-main/20 text-main resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={handlePreview}
              disabled={!isFormValid() || isLoading}
              className="flex-1 bg-gradient-to-r from-gold/90 to-gold hover:from-gold hover:to-gold/80 text-bg-main font-medium hover:shadow-lg hover:shadow-gold/25 transition-all duration-200 border-0"
            >
              <Eye className="w-4 h-4 mr-2" />
              NFT Preview
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
