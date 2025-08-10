'use client';

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useAuthState } from '@campnetwork/origin/react';
import DashboardHeader from './DashboardHeader';
import ItemCard from './ItemCard';
import { ItemsTable } from './ItemsTable';
import EmptyState from './EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useUserItems } from '@/hooks/useUserItems';
import { Filter, Grid, List, Search, SortAsc, RefreshCw, AlertCircle } from 'lucide-react';

type FilterType = 'all' | 'verified' | 'pending_verification' | 'rejected';
type SortType = 'newest' | 'oldest' | 'value-high' | 'value-low';

export default function Dashboard() {
  const { authenticated } = useAuthState();
  const { address, isConnected } = useWalletConnection();
  const { items, isLoading, error, refetch } = useUserItems();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('table');

  // Convert database items to dashboard format
  const dashboardItems = useMemo(() => {
    return items.map(item => ({
      id: item.id,
      title: item.title,
      description: `${item.brand} - ${item.category}`,
      category: item.category,
      verificationStatus: item.status === 'pending_verification' ? 'pending' as const : 
                         item.status === 'verified' ? 'verified' as const :
                         'rejected' as const,
      registrationDate: item.created_at,
      xp: item.status === 'verified' ? 100 : item.status === 'pending_verification' ? 50 : 0,
      coOwners: 1,
      imageUrl: item.item_image_url || '/placeholder-item.jpg',
      estimatedValue: item.estimated_value,
      serialNumber: item.serial_number,
      brand: item.brand,
      itemImageUrl: item.item_image_url,
      billUrl: item.bill_url,
      idUrl: item.id_url,
      nftCertificateUrl: item.nft_certificate_url,
      walletAddress: item.owner_wallet_address,
    }));
  }, [items]);

  // Filter and sort items
  const filteredItems = dashboardItems
    .filter(item => {
      if (filter === 'all') return true;
      const statusMapping = {
        'pending_verification': 'pending',
        'verified': 'verified',
        'rejected': 'rejected'
      };
      const mappedFilter = filter === 'pending_verification' ? 'pending' : filter;
      return item.verificationStatus === mappedFilter;
    })
    .filter(item => {
      if (!searchTerm) return true;
      return item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      switch (sort) {
        case 'newest':
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        case 'oldest':
          return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
        case 'value-high':
          return b.estimatedValue - a.estimatedValue;
        case 'value-low':
          return a.estimatedValue - b.estimatedValue;
        default:
          return 0;
      }
    });

  const getFilterCount = (filterType: FilterType) => {
    if (filterType === 'all') return dashboardItems.length;
    const statusMapping = {
      'pending_verification': 'pending',
      'verified': 'verified',
      'rejected': 'rejected'
    };
    const mappedFilter = filterType === 'pending_verification' ? 'pending' : filterType;
    return dashboardItems.filter(item => item.verificationStatus === mappedFilter).length;
  };

  const getFilterColor = (filterType: FilterType) => {
    switch (filterType) {
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

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <DashboardHeader />

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
                {/* Refresh Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 text-muted hover:text-main border-main/20 hover:border-main/40"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Loading...' : 'Refresh'}
                </Button>

                {/* View Mode Toggle */}
                <div className="flex items-center rounded-lg bg-main/10 border border-main/20 p-1">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 ${viewMode === 'table' ? 'bg-main/20 text-main' : 'text-muted hover:text-main'}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-main/20 text-main' : 'text-muted hover:text-main'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            {!authenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-main">Connect Your Wallet</p>
                    <p className="text-xs text-muted">Connect your wallet to view your registered items</p>
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-main">Failed to Load Items</p>
                    <p className="text-xs text-muted">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {authenticated && isConnected && items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="bg-green/5 border border-green/20 rounded-lg p-4 flex items-center gap-3">
                  <Badge className="bg-green/20 text-green border-green/30">
                    {items.length} Item{items.length !== 1 ? 's' : ''} Found
                  </Badge>
                  <p className="text-sm text-muted">
                    Your registered items from the database
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
                {(['all', 'verified', 'pending_verification', 'rejected'] as FilterType[]).map((filterType) => (
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
                    {filterType === 'all' ? 'All' : 
                     filterType === 'pending_verification' ? 'Pending' :
                     filterType.charAt(0).toUpperCase() + filterType.slice(1)} ({getFilterCount(filterType)})
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
                  <option value="value-high">Highest Value</option>
                  <option value="value-low">Lowest Value</option>
                </select>
              </div>
            </div>

            {/* Items Display */}
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
              <>
                {viewMode === 'table' ? (
                  <ItemsTable items={items.filter(item => {
                    // Apply the same filtering logic for the table
                    const matchesFilter = filter === 'all' || item.status === filter;
                    const matchesSearch = !searchTerm || 
                      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.brand.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchesFilter && matchesSearch;
                  }).sort((a, b) => {
                    switch (sort) {
                      case 'newest':
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                      case 'oldest':
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                      case 'value-high':
                        return b.estimated_value - a.estimated_value;
                      case 'value-low':
                        return a.estimated_value - b.estimated_value;
                      default:
                        return 0;
                    }
                  })} />
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
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
