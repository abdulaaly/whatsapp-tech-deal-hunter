import { useState, useMemo } from 'react';
import rankingsDataRaw from './data/enriched_rankings.json';
import verificationDataRaw from './data/buyer_verification_queue.json';
import type { EnrichedTechProduct, BuyerVerificationData } from './types';
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { HardwareTable } from './components/HardwareTable';
import { BuyerVerificationTab } from './components/BuyerVerificationTab';
import { DetailModal } from './components/DetailModal';
import { VoiceAIAssistant } from './components/VoiceAIAssistant';

const allProducts = rankingsDataRaw as unknown as EnrichedTechProduct[];
const verificationData = verificationDataRaw as unknown as BuyerVerificationData;

export function App() {
  // Extract categories dynamically
  const categories = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.category)));
  }, []);

  const [activeTab, setActiveTab] = useState<string>(categories[0] || 'MacBook Series');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('rank');
  const [selectedItem, setSelectedItem] = useState<EnrichedTechProduct | null>(null);
  const [isVoiceAIOpen, setIsVoiceAIOpen] = useState<boolean>(false);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const map: { [cat: string]: EnrichedTechProduct[] } = {};
    for (const cat of categories) {
      map[cat] = allProducts.filter((p) => p.category === cat);
    }
    return map;
  }, [categories]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: { [cat: string]: number } = {};
    for (const cat of categories) {
      counts[cat] = productsByCategory[cat]?.length || 0;
    }
    return counts;
  }, [categories, productsByCategory]);

  // Voice AI Action Handlers
  const handleVoiceSwitchTab = (category: string) => {
    // Find closest matching category
    const found = categories.find((c) => c.toLowerCase().includes(category.toLowerCase()));
    if (found) {
      setActiveTab(found);
    } else if (category.toLowerCase().includes('verification') || category.toLowerCase().includes('buyer')) {
      setActiveTab('VERIFICATION_QUEUE');
    }
  };

  const handleVoiceSort = (sortOption: string) => {
    setSortBy(sortOption);
  };

  const handleVoiceFilterDuplicates = (enable: boolean) => {
    setShowDuplicatesOnly(enable);
  };

  const handleVoiceSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-[#111B21] text-[#E9EDEF] flex flex-col font-sans selection:bg-[#25D366] selection:text-[#111B21]">
      {/* Top Navigation & Global Search Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalListings={allProducts.length}
        totalCategories={categories.length}
        verifiedReceiptsCount={verificationData.total_receipts_audited}
        showDuplicatesOnly={showDuplicatesOnly}
        setShowDuplicatesOnly={setShowDuplicatesOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onOpenVoiceAI={() => setIsVoiceAIOpen(true)}
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

        {/* View Switcher: Hardware Category Comparison vs Buyer Verification Queue */}
        {activeTab === 'VERIFICATION_QUEUE' ? (
          <BuyerVerificationTab data={verificationData} />
        ) : (
          productsByCategory[activeTab] && (
            <HardwareTable
              category={activeTab}
              items={productsByCategory[activeTab]}
              searchQuery={searchQuery}
              showDuplicatesOnly={showDuplicatesOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onSelectItem={(item) => setSelectedItem(item)}
            />
          )
        )}
      </main>

      {/* Hardware Spec & Cross-Group Duplicate Detail Modal */}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Real-time Voice & Text AI Assistant (Laya + Zeph Powered) */}
      <VoiceAIAssistant
        isOpen={isVoiceAIOpen}
        onClose={() => setIsVoiceAIOpen(false)}
        products={allProducts}
        activeCategory={activeTab}
        onSelectCategory={handleVoiceSwitchTab}
        onSetSortBy={handleVoiceSort}
        onToggleDuplicateView={handleVoiceFilterDuplicates}
        onSetSearchQuery={handleVoiceSearch}
        onSelectProduct={(p) => setSelectedItem(p)}
      />

      {/* Footer */}
      <footer className="border-t border-[#222D34] py-6 text-center text-xs text-[#8696A0] bg-[#111B21] mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
            <span>WhatsApp Tech Deal Radar • Real Multi-Group Cross-Post Engine</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#8696A0]">
            <span>Quetta Godam • Karachi Saddar • Lahore Hafeez Center</span>
            <span>•</span>
            <span className="text-[#25D366]">100% Read-Only Safety Protocol</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
