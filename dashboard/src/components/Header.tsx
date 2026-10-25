import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Layers, 
  PhoneCall, 
  ArrowUpDown
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalListings: number;
  totalCategories: number;
  verifiedReceiptsCount: number;
  showDuplicatesOnly: boolean;
  setShowDuplicatesOnly: (val: boolean | ((prev: boolean) => boolean)) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  onOpenVoiceAI: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  totalListings,
  totalCategories,
  verifiedReceiptsCount,
  showDuplicatesOnly,
  setShowDuplicatesOnly,
  sortBy,
  setSortBy,
  onOpenVoiceAI,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#111B21] border-b border-[#222D34] px-4 lg:px-8 py-3.5 mb-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/20">
            <ShieldCheck className="w-6 h-6 text-[#111B21]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-normal tracking-tight text-[#E9EDEF] flex items-center gap-2">
                WhatsApp Tech Deal Radar
              </h1>
              <span className="text-[10px] uppercase font-normal tracking-wider px-2.5 py-0.5 rounded-full bg-[#005C4B] text-[#25D366] border border-[#25D366]/30">
                Live E2E Audit
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#202C33] text-[#8696A0] border border-[#222D34]">
                {totalListings} Listings in {totalCategories} Cats
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#202C33] text-[#25D366] border border-[#222D34]">
                {verifiedReceiptsCount} Verified Buyers
              </span>
            </div>
            <p className="text-xs text-[#8696A0]">
              Multi-Group Cross-Posts, Duplicate Price Deltas & Buyer Legitimacy Verification
            </p>
          </div>
        </div>

        {/* Global Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          {/* Search Bar */}
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-[#8696A0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model, shop, seller, RAM..."
              className="w-full pl-9 pr-7 py-2 text-xs bg-[#202C33] border border-[#222D34] rounded-full text-[#E9EDEF] placeholder-[#8696A0] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:border-[#25D366] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8696A0] hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Duplicates Toggle Button */}
          <button
            onClick={() => setShowDuplicatesOnly((prev) => !prev)}
            className={`px-3.5 py-2 rounded-full text-xs font-normal transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              showDuplicatesOnly
                ? 'bg-[#005C4B] text-[#25D366] border-[#25D366]/60 shadow-md shadow-[#25D366]/20'
                : 'bg-[#202C33] text-[#8696A0] border-[#222D34] hover:text-[#E9EDEF] hover:bg-[#2A3942]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Group Duplicates</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products by"
              className="appearance-none bg-[#202C33] text-[#E9EDEF] border border-[#222D34] rounded-full px-3.5 py-2 pr-7 text-xs focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 cursor-pointer"
            >
              <option value="rank">Sort: Recommendation Rank</option>
              <option value="savings">Sort: Highest Savings</option>
              <option value="price-asc">Sort: Lowest Price First</option>
              <option value="price-desc">Sort: Highest Price First</option>
              <option value="geekbench">Sort: Geekbench 6 Multi</option>
              <option value="score">Sort: Star Rating</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-[#8696A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* AI Voice Agent Calling Button */}
          <button
            onClick={onOpenVoiceAI}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#25D366] to-[#00A884] hover:from-[#20ba5a] hover:to-[#009172] text-[#111B21] font-normal text-xs transition-all shadow-lg shadow-[#25D366]/20 flex items-center gap-2 whitespace-nowrap active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5 fill-[#111B21]" />
            <span>Call Voice AI</span>
            <span className="w-2 h-2 rounded-full bg-[#111B21] animate-ping" />
          </button>
        </div>
      </div>
    </header>
  );
};
