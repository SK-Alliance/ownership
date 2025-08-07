'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import DashboardHeader from './DashboardHeader';
import ItemCard from './ItemCard';
import EmptyState from './EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserIPNFTs } from '@/lib/hooks/useUserIPNFTs';
import { dummyDashboardData } from '@/data/dashboard';
import { Filter, Grid, List, Search, SortAsc, RefreshCw, AlertCircle } from 'lucide-react';

type FilterType = 'all' | 'verified' | 'pending' | 'rejected';
type SortType = 'newest' | 'oldest' | 'xp-high' | 'xp-low';

export default function Dashboard() {
  const { isConnected } = useAccount();
  const { tokens: ipnftTokens, isLoading: isLoadingTokens, error: tokensError, refetch } = useUserIPNFTs();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Convert IP-NFT tokens to dashboard item format and combine with dummy data
  const dashboardItems = useMemo(() => {
    const convertedTokens = ipnftTokens.map(token => ({
      id: token.tokenId,
      title: token.metadata.name,
      description: token.metadata.description,
      category: token.metadata.attributes?.find(attr => attr.trait_type === 'Category')?.value || 'Uncategorized',
      verificationStatus: 'verified' as const,
      registrationDate: token.createdAt || new Date().toISOString(),
      xp: 100, // Base XP for verified IP-NFT
      coOwners: 1, // IP-NFTs typically have single ownership initially
      imageUrl: token.metadata.image || '/placeholder-item.jpg',
      ipnftTokenId: token.tokenId,
      estimatedValue: token.metadata.attributes?.find(attr => attr.trait_type === 'Estimated Value')?.value || 'N/A'
    }));

    // For demo purposes, also include dummy data but mark them as different
    const dummyItems = dummyDashboardData.items.map(item => ({
      ...item,
      ipnftTokenId: undefined as string | undefined // Mark as non-IP-NFT items
    }));

    return [...convertedTokens, ...dummyItems];
  }, [ipnftTokens]);

  // Filter and sort items
  const filteredItems = dashboardItems
    .filter(item => {
      if (filter === 'all') return true;
      return item.verificationStatus === filter;
    })
    .filter(item => {
      if (!searchTerm) return true;
      return item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.category.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        case 'oldest':
          return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
        case 'xp-high':
          return b.xp - a.xp;
        case 'xp-low':
          return a.xp - b.xp;
        default:
          return 0;
      }
    });

  const getFilterCount = (filterType: FilterType) => {
    if (filterType === 'all') return dashboardItems.length;
    return dashboardItems.filter(item => item.verificationStatus === filterType).length;
  };

  const getFilterColor = (filterType: FilterType) => {
    switch (filterType) {
      case 'verified':
        return 'bg-green/20 text-green border-green/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-main/10 text-main border-main/20';
    }
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <DashboardHeader user={dummyDashboardData.user} />

          {/* Items Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-clash text-main mb-2">My Registered Items</h2>
                <p className="text-muted">
                  Manage your intellectual property portfolio and track verification status
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Refresh IP-NFTs Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoadingTokens}
                  className="flex items-center gap-2 px-3 py-2 text-muted hover:text-main border-main/20 hover:border-main/40"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingTokens ? 'animate-spin' : ''}`} />
                  {isLoadingTokens ? 'Loading...' : 'Refresh'}
                </Button>

                {/* View Mode Toggle */}
                <div className="flex items-center rounded-lg bg-main/10 border border-main/20 p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-main/20 text-main' : 'text-muted hover:text-main'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-main/20 text-main' : 'text-muted hover:text-main'}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* IP-NFT Status Display */}
            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-main">Connect Your Wallet</p>
                    <p className="text-xs text-muted">Connect your wallet to view your IP certificates</p>
                  </div>
                </div>
              </motion.div>
            )}

            {tokensError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-main">Failed to Load IP Certificates</p>
                    <p className="text-xs text-muted">{tokensError}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {isConnected && ipnftTokens.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="bg-green/5 border border-green/20 rounded-lg p-4 flex items-center gap-3">
                  <Badge className="bg-green/20 text-green border-green/30">
                    {ipnftTokens.length} IP Certificate{ipnftTokens.length !== 1 ? 's' : ''} Found
                  </Badge>
                  <p className="text-sm text-muted">
                    Your registered IP certificates are displayed with verified status
                  </p>
                </div>
              </motion.div>
            )}

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-main/10 border border-main/20 text-main placeholder-muted focus:outline-none focus:border-main/40 focus:bg-main/15 transition-all duration-200"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-muted">
                  <Filter className="w-4 h-4" />
                  <span>Filter:</span>
                </div>
                {(['all', 'verified', 'pending', 'rejected'] as FilterType[]).map((filterType) => (
                  <Badge
                    key={filterType}
                    variant={filter === filterType ? 'default' : 'outline'}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      filter === filterType 
                        ? getFilterColor(filterType)
                        : 'hover:bg-main/10 hover:text-main'
                    }`}
                    onClick={() => setFilter(filterType)}
                  >
                    {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)} ({getFilterCount(filterType)})
                  </Badge>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-muted">
                  <SortAsc className="w-4 h-4" />
                  <span>Sort:</span>
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortType)}
                  className="px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main text-sm focus:outline-none focus:border-main/40 focus:bg-main/15 transition-all duration-200"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="xp-high">Highest XP</option>
                  <option value="xp-low">Lowest XP</option>
                </select>
              </div>
            </div>

            {/* Items Grid/List */}
            {filteredItems.length === 0 ? (
              searchTerm || filter !== 'all' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-16"
                >
                  <div className="text-muted mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold text-main mb-2">No items found</h3>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'No items match the selected filter'}
                  </p>
                </motion.div>
              ) : (
                <EmptyState />
              )
            ) : (
              <motion.div
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
                layout
                transition={{ duration: 0.3 }}
              >
                {filteredItems.map((item, index) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
