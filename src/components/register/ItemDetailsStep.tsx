'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRegistrationStore } from '@/lib/stores/registration-store';
import { Package, FileText, DollarSign, Calendar, Hash, Tag } from 'lucide-react';

const categories = [
  'Electronics',
  'Jewelry',
  'Artwork',
  'Collectibles',
  'Watches',
  'Vehicles',
  'Real Estate',
  'Documents',
  'Other'
];

export default function ItemDetailsStep() {
  const { itemDetails, updateItemDetails } = useRegistrationStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-main/20 bg-surface/50 backdrop-blur-md">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold/30"
          >
            <Package className="w-8 h-8 text-gold" />
          </motion.div>
          <CardTitle className="text-2xl font-clash text-main">
            Item Details
          </CardTitle>
          <CardDescription className="text-muted">
            Tell us about the item you want to register
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Item Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="name" className="text-main font-medium flex items-center gap-2">
              <Tag className="w-4 h-4 text-gold" />
              Item Name *
            </Label>
            <Input
              id="name"
              placeholder="e.g., iPhone 15 Pro, Rolex Submariner, Original Painting"
              value={itemDetails.name}
              onChange={(e) => updateItemDetails({ name: e.target.value })}
              className="bg-bg-main/50 border-main/30 focus:border-gold text-main placeholder:text-muted"
            />
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-2"
          >
            <Label className="text-main font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-gold" />
              Category *
            </Label>
            <Select
              value={itemDetails.category}
              onValueChange={(value) => updateItemDetails({ category: value })}
            >
              <SelectTrigger className="bg-bg-main/50 border-main/30 focus:border-gold text-main">
                <SelectValue placeholder="Select item category" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-main/30">
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="description" className="text-main font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your item's condition, features, or any unique characteristics..."
              rows={3}
              value={itemDetails.description}
              onChange={(e) => updateItemDetails({ description: e.target.value })}
              className="bg-bg-main/50 border-main/30 focus:border-gold text-main placeholder:text-muted resize-none"
            />
          </motion.div>

          {/* Value and Purchase Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="value" className="text-main font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green" />
                Estimated Value *
              </Label>
              <Input
                id="value"
                placeholder="$0.00"
                value={itemDetails.value}
                onChange={(e) => updateItemDetails({ value: e.target.value })}
                className="bg-bg-main/50 border-main/30 focus:border-gold text-main placeholder:text-muted"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="purchaseDate" className="text-main font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue" />
                Purchase Date
              </Label>
              <Input
                id="purchaseDate"
                type="date"
                value={itemDetails.purchaseDate}
                onChange={(e) => updateItemDetails({ purchaseDate: e.target.value })}
                className="bg-bg-main/50 border-main/30 focus:border-gold text-main placeholder:text-muted"
              />
            </motion.div>
          </div>

          {/* Serial Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="serialNumber" className="text-main font-medium flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue" />
              Serial Number / Model
            </Label>
            <Input
              id="serialNumber"
              placeholder="e.g., ABC123456789, Model XYZ-2024"
              value={itemDetails.serialNumber}
              onChange={(e) => updateItemDetails({ serialNumber: e.target.value })}
              className="bg-bg-main/50 border-main/30 focus:border-gold text-main placeholder:text-muted"
            />
          </motion.div>

          {/* Required Fields Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex items-center gap-2 p-4 bg-gold/5 border border-gold/20 rounded-lg"
          >
            <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0" />
            <p className="text-sm text-muted">
              Fields marked with * are required to proceed
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
