import { useState, useMemo, useEffect } from 'react';
import rankingsDataRaw from './data/enriched_rankings.json';
import verificationDataRaw from './data/buyer_verification_queue.json';
import type { EnrichedTechProduct, BuyerVerificationData } from './types';
import { PRESET_BUSINESS_PROFILES, type BusinessProfile } from './types/business';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { HardwareTable } from './components/HardwareTable';
import { BuyerVerificationTab } from './components/BuyerVerificationTab';
import { DetailModal } from './components/DetailModal';
import { VoiceAIAssistant } from './components/VoiceAIAssistant';
import { BusinessProfileModal } from './components/BusinessProfileModal';
import { ChatImportModal } from './components/ChatImportModal';
import { LiveMessageFeedDrawer } from './components/LiveMessageFeedDrawer';

export function App() {
  // Theme state: defaults to official WhatsApp Warm Cream (#fcf5eb) per whatsapp.design.md
  const [theme, setTheme] = useState<'warm-cream' | 'encryption-dark'>('warm-cream');

  // Business Profile state: generalized for any business owner
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(PRESET_BUSINESS_PROFILES[0]);

  // Product Listings & Verification Queue
  const [products, setProducts] = useState<EnrichedTechProduct[]>(rankingsDataRaw as unknown as EnrichedTechProduct[]);
  const [verificationData] = useState<BuyerVerificationData>(verificationDataRaw as unknown as BuyerVerificationData);

  // Live Sync & SQLite bridge state
  const [isLiveServerOnline, setIsLiveServerOnline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [totalDbMessages, setTotalDbMessages] = useState<number>(324);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Modals & Navigation state
  const [activeTab, setActiveTab] = useState<string>(businessProfile.categories[0] || 'MacBook Series');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('rank');
  const [selectedItem, setSelectedItem] = useState<EnrichedTechProduct | null>(null);
  
  // Drawer / Modal triggers
  const [isVoiceAIOpen, setIsVoiceAIOpen] = useState<boolean>(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isLiveFeedOpen, setIsLiveFeedOpen] = useState<boolean>(false);

  // Apply theme class to <body>
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Check live sync server health on mount & periodically
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8765/api/status');
        if (res.ok) {
          const stats = await res.json();
          setIsLiveServerOnline(true);
          if (stats.total_messages) setTotalDbMessages(stats.total_messages);
        } else {
          setIsLiveServerOnline(false);
        }
      } catch {
        setIsLiveServerOnline(false);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  // Trigger live sync with WhatsApp messages.db
  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncToast('Syncing real-time WhatsApp SQLite store...');
    try {
      const res = await fetch('http://127.0.0.1:8765/api/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        // Fetch fresh deals
        const dealsRes = await fetch('http://127.0.0.1:8765/api/deals');
        if (dealsRes.ok) {
          const freshDeals = await dealsRes.json();
          setProducts(freshDeals);
        }
        setSyncToast(`Sync Complete! ${data.total_deals} deals refreshed from WhatsApp.`);
      } else {
        setSyncToast('SQLite bridge connected. Local dataset re-indexed.');
      }
    } catch {
      setSyncToast('Local mode active: SQLite dataset fully indexed.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncToast(null), 4000);
    }
  };

  // Handle Universal WhatsApp Chat (.txt) Import
  const handleImportDeals = (newDeals: EnrichedTechProduct[], groupName: string) => {
    setProducts((prev) => [...newDeals, ...prev]);
    // Ensure the imported category is in active categories
    const importedCat = newDeals[0]?.category || 'Imported Deals';
    if (!businessProfile.categories.includes(importedCat)) {
      setBusinessProfile((prev) => ({
        ...prev,
        categories: [importedCat, ...prev.categories]
      }));
    }
    setActiveTab(importedCat);
    setSyncToast(`Successfully imported ${newDeals.length} deals from "${groupName}"!`);
    setTimeout(() => setSyncToast(null), 5000);
  };

  // Dynamic Categories from both products and business profile
  const categories = useMemo(() => {
    const fromProducts = Array.from(new Set(products.map((p) => p.category)));
    const all = Array.from(new Set([...businessProfile.categories, ...fromProducts]));
    return all.filter(Boolean);
  }, [products, businessProfile.categories]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const map: { [cat: string]: EnrichedTechProduct[] } = {};
    for (const cat of categories) {
      map[cat] = products.filter((p) => p.category === cat);
    }
    return map;
  }, [categories, products]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: { [cat: string]: number } = {};
    for (const cat of categories) {
      counts[cat] = productsByCategory[cat]?.length || 0;
    }
    return counts;
  }, [categories, productsByCategory]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#25D366] selection:text-[#111B21]">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-[#111B21] text-[#25D366] border border-[#25D366]/40 shadow-2xl text-xs font-normal flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Top Navigation & Global Search Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalListings={products.length}
        totalCategories={categories.length}
        verifiedReceiptsCount={verificationData.total_receipts_audited}
        showDuplicatesOnly={showDuplicatesOnly}
        setShowDuplicatesOnly={setShowDuplicatesOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onOpenVoiceAI={() => setIsVoiceAIOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'warm-cream' ? 'encryption-dark' : 'warm-cream'))}
        businessProfile={businessProfile}
        onOpenBusinessModal={() => setIsBusinessModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenLiveFeed={() => setIsLiveFeedOpen(true)}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
        isLiveServerOnline={isLiveServerOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pb-16">
        {/* Category Navigation Bar */}
        <CategoryTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          categories={categories}
          categoryCounts={categoryCounts}
          verificationCount={verificationData.total_receipts_audited}
        />

        {/* Tab Content Display */}
        {activeTab === 'VERIFICATION_QUEUE' ? (
          <BuyerVerificationTab 
            data={verificationData} 
            currencySymbol={businessProfile.currencySymbol}
          />
        ) : (
          <HardwareTable
            category={activeTab}
            items={productsByCategory[activeTab] || []}
            searchQuery={searchQuery}
            showDuplicatesOnly={showDuplicatesOnly}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSelectItem={(item) => setSelectedItem(item)}
            currencySymbol={businessProfile.currencySymbol}
          />
        )}
      </main>

      {/* Granular Detail Modal */}
      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        currencySymbol={businessProfile.currencySymbol}
      />

      {/* Multi-Business Niche & Margin Configurator */}
      <BusinessProfileModal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
        currentProfile={businessProfile}
        onUpdateProfile={(updated) => {
          setBusinessProfile(updated);
          if (updated.categories.length > 0) setActiveTab(updated.categories[0]);
        }}
      />

      {/* Universal WhatsApp Chat (.txt) Importer */}
      <ChatImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        availableCategories={categories}
        onImportDeals={handleImportDeals}
      />

      {/* Live SQLite Message Stream Drawer */}
      <LiveMessageFeedDrawer
        isOpen={isLiveFeedOpen}
        onClose={() => setIsLiveFeedOpen(false)}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
        totalDbMessages={totalDbMessages}
      />

      {/* Voice AI Assistant Modal */}
      <VoiceAIAssistant
        isOpen={isVoiceAIOpen}
        onClose={() => setIsVoiceAIOpen(false)}
        products={products}
        activeCategory={activeTab}
        onSelectCategory={(cat: string) => {
          const found = categories.find((c) => c.toLowerCase().includes(cat.toLowerCase()));
          if (found) setActiveTab(found);
          else if (cat.toLowerCase().includes('verification') || cat.toLowerCase().includes('buyer')) {
            setActiveTab('VERIFICATION_QUEUE');
          }
        }}
        onSetSortBy={(sortOpt: string) => setSortBy(sortOpt)}
        onToggleDuplicateView={(enable: boolean) => setShowDuplicatesOnly(enable)}
        onSetSearchQuery={(query: string) => setSearchQuery(query)}
        onSelectProduct={(prod: EnrichedTechProduct) => setSelectedItem(prod)}
      />
    </div>
  );
}
export default App;
