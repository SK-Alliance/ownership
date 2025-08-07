'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CoOwner } from '@/types/item';
import { 
  Users, 
  Plus, 
  Trash2,
  Calendar,
  Shield,
  Wallet
} from 'lucide-react';

interface CoOwnerManagerProps {
  coOwners: CoOwner[];
  itemId: string;
  onAddCoOwner: (itemId: string, walletAddress: string, permissions: string[]) => void;
  onRemoveCoOwner: (itemId: string, walletAddress: string) => void;
  isOwner: boolean;
}

export default function CoOwnerManager({ 
  coOwners, 
  itemId, 
  onAddCoOwner, 
  onRemoveCoOwner, 
  isOwner 
}: CoOwnerManagerProps) {
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['view']);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAddCoOwner = () => {
    if (!newWalletAddress.trim() || selectedPermissions.length === 0) return;
    
    onAddCoOwner(itemId, newWalletAddress.trim(), selectedPermissions);
    setNewWalletAddress('');
    setSelectedPermissions(['view']);
  };

  const availablePermissions = [
    { id: 'view', label: 'View', description: 'Can view item details' },
    { id: 'edit', label: 'Edit', description: 'Can modify item metadata' },
    { id: 'transfer', label: 'Transfer', description: 'Can transfer ownership' },
  ];

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
    >
      <Card 
        className="relative border border-main/20 overflow-hidden backdrop-blur-xl"
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
          className="absolute inset-0"
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
          className="absolute top-0 left-4 right-4 h-px"
          style={{
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(255, 255, 255, 0.2), 
              transparent
            )`
          }}
        />

        <div className="relative z-10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue" />
                <CardTitle className="text-xl font-clash text-main">
                  Co-owners ({coOwners.length})
                </CardTitle>
              </div>
              
              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-main/5 border-main/20 text-main hover:bg-main/10 hover:border-gold/30 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Co-owner
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-bg-main border-main/20">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-main">Add Co-owner</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted">
                        Enter the wallet address and select permissions for the new co-owner.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="space-y-4">
                      {/* Wallet Address Input */}
                      <div>
                        <label className="text-sm font-medium text-main mb-2 block">
                          Wallet Address
                        </label>
                        <input
                          type="text"
                          placeholder="0x..."
                          value={newWalletAddress}
                          onChange={(e) => setNewWalletAddress(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main placeholder-muted focus:outline-none focus:border-main/40 focus:bg-main/15 transition-all duration-200"
                        />
                      </div>

                      {/* Permissions */}
                      <div>
                        <label className="text-sm font-medium text-main mb-3 block">
                          Permissions
                        </label>
                        <div className="space-y-2">
                          {availablePermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-3 p-3 rounded-lg bg-main/5 border border-main/10 hover:bg-main/10 transition-colors cursor-pointer"
                              onClick={() => togglePermission(permission.id)}
                            >
                              <div
                                className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                                  selectedPermissions.includes(permission.id)
                                    ? 'bg-gold border-gold'
                                    : 'border-main/30'
                                }`}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-main">{permission.label}</div>
                                <div className="text-xs text-muted">{permission.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-main/10 border-main/20 text-main hover:bg-main/15">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleAddCoOwner}
                        disabled={!newWalletAddress.trim() || selectedPermissions.length === 0}
                        className="bg-gold hover:bg-gold/90 text-bg-main disabled:opacity-50"
                      >
                        Add Co-owner
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {coOwners.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted/50 mx-auto mb-3" />
                <p className="text-muted">No co-owners added yet</p>
                {isOwner && (
                  <p className="text-sm text-muted mt-1">
                    Add co-owners to share ownership of this item
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {coOwners.map((coOwner, index) => (
                  <motion.div
                    key={coOwner.walletAddress}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-main/5 border border-main/10 hover:bg-main/8 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-gold" />
                      </div>
                      
                      <div className="space-y-1">
                        <code className="text-sm text-main font-mono bg-main/10 px-2 py-1 rounded">
                          {formatAddress(coOwner.walletAddress)}
                        </code>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-muted" />
                          <span className="text-xs text-muted">
                            Added {formatDate(coOwner.addedDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Permissions */}
                      <div className="flex gap-1">
                        {coOwner.permissions.map((permission) => (
                          <Badge
                            key={permission}
                            variant="outline"
                            className="text-xs bg-main/10 border-main/20 text-main"
                          >
                            <Shield className="w-2.5 h-2.5 mr-1" />
                            {permission}
                          </Badge>
                        ))}
                      </div>

                      {/* Remove Button */}
                      {isOwner && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-bg-main border-main/20">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-main">Remove Co-owner</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted">
                                Are you sure you want to remove this co-owner? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-main/10 border-main/20 text-main hover:bg-main/15">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onRemoveCoOwner(itemId, coOwner.walletAddress)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
