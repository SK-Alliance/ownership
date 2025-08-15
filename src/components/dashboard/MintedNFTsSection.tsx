'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useMintedNFTs } from '@/hooks/useMintedNFTs';
import { MintedNFTCard } from './MintedNFTCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  Search, 
  SortAsc,
  Filter,
  Grid,
  List
} from 'lucide-react';

type SortOption = 'newest' | 'oldest' | 'value-high' | 'value-low' | 'name-az' | 'name-za';

export function MintedNFTsSection() {
  const { nfts, isLoading, error, refetch } = useMintedNFTs();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories from NFTs
  const categories = ['all', ...new Set(nfts.map(nft => nft.category))];

  // Filter and sort NFTs
  const filteredNfts = nfts
    .filter(nft => {
      const matchesSearch = !searchTerm || 
        nft.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nft.manufacturer && nft.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (nft.model && nft.model.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || nft.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime();
        case 'oldest':
          return new Date(a.mintedAt).getTime() - new Date(b.mintedAt).getTime();
        case 'value-high':
          return b.estimatedValue - a.estimatedValue;
        case 'value-low':
          return a.estimatedValue - b.estimatedValue;
        case 'name-az':
          return a.itemName.localeCompare(b.itemName);
        case 'name-za':
          return b.itemName.localeCompare(a.itemName);
        default:
          return 0;
      }
    });

  const getCategoryCount = (category: string) => {
    if (category === 'all') return nfts.length;
    return nfts.filter(nft => nft.category === category).length;
  };

  const getTotalValue = () => {
    return filteredNfts.reduce((sum, nft) => sum + nft.estimatedValue, 0);
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-12"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-clash text-main mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            Minted NFTs
          </h2>
          <p className="text-muted">
            Your digital ownership certificates stored on the blockchain
          </p>
          {filteredNfts.length > 0 && (
            <div className="flex items-center gap-4 mt-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {filteredNfts.length} NFT{filteredNfts.length !== 1 ? 's' : ''}
              </Badge>
              <Badge className="bg-green/20 text-green border-green/30">
                Total Value: {formatValue(getTotalValue())}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-muted hover:text-main border-main/20 hover:border-main/40"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
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

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-main">Failed to Load Minted NFTs</p>
              <p className="text-xs text-muted">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-main/5 rounded-2xl border border-main/10">
                <div className="aspect-square bg-main/10 rounded-t-2xl" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-main/10 rounded w-3/4" />
                  <div className="h-3 bg-main/10 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-main/10 rounded" />
                    <div className="h-3 bg-main/10 rounded w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters and Search - Only show if NFTs exist */}
      {!isLoading && nfts.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-main/10 border border-main/20 text-main placeholder-muted focus:outline-none focus:border-main/40 focus:bg-main/15 transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-muted">
              <Filter className="w-4 h-4" />
              <span>Category:</span>
            </div>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category 
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    : 'hover:bg-main/10 hover:text-main'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)} 
                ({getCategoryCount(category)})
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
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-lg bg-main/10 border border-main/20 text-main text-sm focus:outline-none focus:border-main/40 focus:bg-main/15 transition-all duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="value-high">Highest Value</option>
              <option value="value-low">Lowest Value</option>
              <option value="name-az">Name A-Z</option>
              <option value="name-za">Name Z-A</option>
            </select>
          </div>
        </div>
      )}

      {/* NFTs Display */}
      {!isLoading && (
        <>
          {filteredNfts.length === 0 ? (
            <div className="text-center py-16">
              {nfts.length === 0 ? (
                // No NFTs at all
                <div className="max-w-md mx-auto">
                  <Sparkles className="w-20 h-20 text-main/20 mx-auto mb-6" />
                  <h3 className="text-2xl font-clash text-main mb-3">No NFTs Minted Yet</h3>
                  <p className="text-muted mb-6">
                    Start minting your first NFT to create digital ownership certificates for your items.
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => window.location.href = '/mint'}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Mint Your First NFT
                  </Button>
                </div>
              ) : (
                // No NFTs match filter/search
                <div className="max-w-md mx-auto">
                  <Search className="w-16 h-16 text-main/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-main mb-2">No matching NFTs</h3>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'No NFTs match the selected category'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}
              layout
              transition={{ duration: 0.3 }}
            >
              {filteredNfts.map((nft, index) => (
                <MintedNFTCard 
                  key={nft.id} 
                  nft={nft} 
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
