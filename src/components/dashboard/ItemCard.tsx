'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RegisteredItem } from '@/types/dashboard';
import { getStatusColor } from '@/data/dashboard';
import { 
  Eye, 
  FileText, 
  Users, 
  Calendar,
  Shield,
  ShieldCheck,
  ShieldX,
  Clock
} from 'lucide-react';

interface ItemCardProps {
  item: RegisteredItem;
  index: number;
}

export default function ItemCard({ item, index }: ItemCardProps) {
  const getStatusIcon = (status: RegisteredItem['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return <ShieldCheck className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'rejected':
        return <ShieldX className="w-3 h-3" />;
      default:
        return <Shield className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: RegisteredItem['verificationStatus']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Digital Art': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Music': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'Photography': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Video': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Design': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Literature': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card 
        className="relative h-full border border-main/20 overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-main/30 hover:shadow-glow"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.03) 30%, 
            rgba(255, 255, 255, 0.01) 70%,
            transparent 100%
          )`
        }}
      >
        {/* Glass morphism overlay */}
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 50%, 
              transparent 100%
            )`,
            backdropFilter: 'blur(20px)'
          }}
        />

        {/* Top highlight edge */}
        <div 
          className="absolute top-0 left-2 right-2 h-px opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(255, 255, 255, 0.3), 
              transparent
            )`
          }}
        />

        <div className="relative z-10">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-main text-lg leading-tight line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <Badge 
                  variant="outline" 
                  className={`${getCategoryColor(item.category)} text-xs font-medium border`}
                >
                  {item.category}
                </Badge>
              </div>
              <Badge 
                className={`${getStatusColor(item.verificationStatus)} text-white border-0 text-xs font-medium flex items-center gap-1 px-2 py-1`}
              >
                {getStatusIcon(item.verificationStatus)}
                {getStatusText(item.verificationStatus)}
              </Badge>
            </div>

            {item.description && (
              <p className="text-muted text-sm line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </CardHeader>

          <CardContent className="py-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-main/5 border border-main/10">
                <div className="text-2xl font-bold text-main mb-1">{item.xp}</div>
                <div className="text-xs text-muted">XP Earned</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-main/5 border border-main/10">
                <div className="text-2xl font-bold text-main mb-1">{item.coOwners}</div>
                <div className="text-xs text-muted">Co-owners</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted">
              <Calendar className="w-3 h-3" />
              <span>Registered {formatDate(item.registrationDate)}</span>
            </div>
          </CardContent>

          <CardFooter className="pt-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-main/5 border-main/20 text-main hover:bg-main/10 hover:border-main/30 transition-all duration-200"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-main/5 border-main/20 text-main hover:bg-main/10 hover:border-main/30 transition-all duration-200"
            >
              <FileText className="w-3 h-3 mr-1" />
              PPD
            </Button>
            {item.coOwners > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="bg-main/5 border-main/20 text-main hover:bg-main/10 hover:border-main/30 transition-all duration-200"
              >
                <Users className="w-3 h-3" />
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
