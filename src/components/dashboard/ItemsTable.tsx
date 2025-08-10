import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  FileText, 
  Receipt, 
  CreditCard, 
  Award,
  Calendar,
  DollarSign,
  Tag,
  Hash,
  Building
} from 'lucide-react';
import { UserItem } from '@/hooks/useUserItems';

interface ItemsTableProps {
  items: UserItem[];
}

const formatValue = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'verified':
      return 'bg-green/20 text-green border-green/30';
    case 'pending_verification':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'rejected':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-main/10 text-main border-main/20';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'electronics':
      return <Tag className="w-4 h-4" />;
    case 'vehicles':
      return <Hash className="w-4 h-4" />;
    case 'jewelry':
      return <Award className="w-4 h-4" />;
    case 'art':
      return <FileText className="w-4 h-4" />;
    case 'real_estate':
      return <Building className="w-4 h-4" />;
    default:
      return <Tag className="w-4 h-4" />;
  }
};

export const ItemsTable: React.FC<ItemsTableProps> = ({ items }) => {
  return (
    <div className="bg-main/5 border border-main/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-main/10 border-b border-main/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-main">Item Details</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-main">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-main">Value</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-main">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-main">Documents</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-main">Registered</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-main">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-main/10">
            {items.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-main/5 transition-colors duration-200"
              >
                {/* Item Details */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {item.item_image_url && (
                      <img
                        src={item.item_image_url}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover border border-main/20"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-main text-sm">{item.title}</h3>
                      <p className="text-muted text-xs">{item.brand}</p>
                      {item.serial_number && (
                        <p className="text-muted text-xs">SN: {item.serial_number}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(item.category)}
                    <span className="text-sm text-main capitalize">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>
                </td>

                {/* Value */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green" />
                    <span className="text-sm font-medium text-main">
                      {formatValue(item.estimated_value)}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </td>

                {/* Documents */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {item.item_image_url && (
                      <div className="w-2 h-2 bg-green rounded-full" title="Image uploaded" />
                    )}
                    {item.bill_url && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full" title="Bill uploaded" />
                    )}
                    {item.id_url && (
                      <div className="w-2 h-2 bg-purple-400 rounded-full" title="ID uploaded" />
                    )}
                    {item.nft_certificate_url && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full" title="NFT certificate" />
                    )}
                  </div>
                </td>

                {/* Registered Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="text-sm text-muted">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-main/10"
                      onClick={() => window.open(`/item/${item.id}`, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {item.bill_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-main/10"
                        onClick={() => window.open(item.bill_url!, '_blank')}
                        title="View Bill"
                      >
                        <Receipt className="w-4 h-4" />
                      </Button>
                    )}
                    {item.id_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-main/10"
                        onClick={() => window.open(item.id_url!, '_blank')}
                        title="View ID Document"
                      >
                        <CreditCard className="w-4 h-4" />
                      </Button>
                    )}
                    {item.nft_certificate_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-main/10"
                        onClick={() => window.open(item.nft_certificate_url!, '_blank')}
                        title="View NFT Certificate"
                      >
                        <Award className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
