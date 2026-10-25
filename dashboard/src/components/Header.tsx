import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Layers, 
  PhoneCall, 
  ArrowUpDown, 
  RefreshCw, 
  Sun, 
  Moon, 
  Building2, 
  UploadCloud, 
  Radio,
  ShoppingBag
} from 'lucide-react';
import type { BusinessProfile } from '../types/business';

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
  theme: 'warm-cream' | 'encryption-dark';
  onToggleTheme: () => void;
  businessProfile: BusinessProfile;
  onOpenBusinessModal: () => void;
  onOpenImportModal: () => void;
  onOpenLiveFeed: () => void;
  onOpenAlRahimModal: () => void;
  onSyncNow: () => void;
  isSyncing: boolean;
  isLiveServerOnline: boolean;
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
  theme,
  onToggleTheme,
  businessProfile,
  onOpenBusinessModal,
  onOpenImportModal,
  onOpenLiveFeed,
  onOpenAlRahimModal,
  onSyncNow,
  isSyncing,
  isLiveServerOnline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[var(--wa-surface)] border-b border-[var(--wa-border)] px-4 lg:px-8 py-3.5 mb-6 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-3.5">
        {/* Top Level: Brand, Status & Main Global Action Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Multi-Business Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/20 shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#111B21]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-normal tracking-tight text-[var(--wa-ink)] flex items-center gap-2">
                  {businessProfile.name}
                </h1>
                
                {/* Live Real-Time SQLite Status Badge */}
                <button
                  onClick={onOpenLiveFeed}
                  className={`text-[10px] uppercase font-normal tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-colors border ${
                    isLiveServerOnline
                      ? 'bg-[#005C4B]/20 text-[#25D366] border-[#25D366]/40 hover:bg-[#005C4B]/30'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}
                  title="Click to view live WhatsApp SQLite message stream"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isLiveServerOnline ? 'bg-[#25D366] animate-pulse' : 'bg-amber-500'}`} />
                  <span>{isLiveServerOnline ? 'Live WhatsApp DB (Port 8765)' : 'Local Offline Store'}</span>
                </button>

                {/* Counts badge */}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--wa-surface-subtle)] text-[var(--wa-ink-muted)] border border-[var(--wa-border)]">
                  {totalListings} Deals in {totalCategories} Cats
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20">
                  {verifiedReceiptsCount} Verified Receipts
                </span>
              </div>
              <p className="text-xs text-[var(--wa-ink-muted)] mt-0.5">
                {businessProfile.tagline} • Multi-Group Cross-Posts & Buyer Verification
              </p>
            </div>
          </div>

          {/* Action Tools: Live Sync, Niche Switcher, Chat Import, Theme Switcher, Voice AI */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Live Sync Now Button */}
            <button
              onClick={onSyncNow}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-[var(--wa-ink)] hover:bg-[#25D366]/20 text-xs font-normal transition-all flex items-center gap-1.5"
              title="Sync real-time changes from WhatsApp messages.db"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#25D366]' : 'text-[#25D366]'}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            {/* Live Stream Drawer */}
            <button
              onClick={onOpenLiveFeed}
              className="px-3 py-2 rounded-full border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] text-[var(--wa-ink)] hover:border-[#25D366] text-xs font-normal transition-all flex items-center gap-1.5"
              title="View live raw WhatsApp messages from SQLite"
            >
              <Radio className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">Live Feed</span>
            </button>

            {/* Universal Chat Import (.txt) */}
            <button
              onClick={onOpenImportModal}
              className="px-3 py-2 rounded-full border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] text-[var(--wa-ink)] hover:border-[#25D366] text-xs font-normal transition-all flex items-center gap-1.5"
              title="Import WhatsApp chat export (.txt) from any group"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">Import Chat</span>
            </button>

            {/* Al-Rahim Mobile Market & Shopify Store Generator */}
            <button
              onClick={onOpenAlRahimModal}
              className="px-3 py-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-[var(--wa-ink)] hover:bg-[#25D366]/20 text-xs font-normal transition-all flex items-center gap-1.5"
              title="Al-Rahim Mobile Market (73 WhatsApp messages, 6 Dups, Shopify Store Export)"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden md:inline font-normal">Al-Rahim & Shopify</span>
            </button>

            {/* Business Niche Configurator */}
            <button
              onClick={onOpenBusinessModal}
              className="px-3 py-2 rounded-full border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] text-[var(--wa-ink)] hover:border-[#25D366] text-xs font-normal transition-all flex items-center gap-1.5"
              title="Change business niche, custom categories, or target margins"
            >
              <Building2 className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">{businessProfile.currency} ({businessProfile.currencySymbol})</span>
            </button>

            {/* Theme Toggle (Official Warm Cream vs Encryption Dark) */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] text-[var(--wa-ink)] hover:border-[#25D366] transition-colors"
              title={`Switch to ${theme === 'warm-cream' ? 'Encryption Dark' : 'Warm Cream (Official WhatsApp)'}`}
            >
              {theme === 'warm-cream' ? (
                <Moon className="w-4 h-4 text-[#1C1E21]" />
              ) : (
                <Sun className="w-4 h-4 text-[#25D366]" />
              )}
            </button>

            {/* Voice AI Assistant Call Button */}
            <button
              onClick={onOpenVoiceAI}
              className="px-4 py-2 rounded-full bg-[#25D366] text-[#111B21] text-xs font-normal flex items-center gap-1.5 hover:bg-[#20ba5a] shadow-md shadow-[#25D366]/20 transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Voice AI</span>
            </button>
          </div>
        </div>

        {/* Bottom Level: Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[var(--wa-border)]">
          {/* Search Bar */}
          <div className="w-full sm:w-96 relative">
            <Search className="w-4 h-4 text-[var(--wa-ink-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search model, shop, seller phone, RAM, GPU..."
              className="w-full pl-9 pr-7 py-2 text-xs bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] rounded-full text-[var(--wa-ink)] placeholder-[var(--wa-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:border-[#25D366] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--wa-ink-muted)] hover:text-[var(--wa-ink)]"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Duplicates Toggle Button */}
            <button
              onClick={() => setShowDuplicatesOnly((prev) => !prev)}
              className={`px-3.5 py-2 rounded-full text-xs font-normal transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                showDuplicatesOnly
                  ? 'bg-[#005C4B]/20 text-[#25D366] border-[#25D366]/60 shadow-sm'
                  : 'bg-[var(--wa-surface-subtle)] text-[var(--wa-ink-muted)] border-[var(--wa-border)] hover:text-[var(--wa-ink)] hover:bg-[var(--wa-surface)]'
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
                className="appearance-none pl-8 pr-8 py-2 text-xs bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] rounded-full text-[var(--wa-ink)] focus:outline-none focus:border-[#25D366] cursor-pointer"
              >
                <option value="rank">Recommended Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="savings-desc">Maximum Savings</option>
                <option value="duplicates-desc">Most Cross-Posted</option>
                <option value="benchmark-desc">Highest Benchmark Score</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--wa-ink-muted)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
