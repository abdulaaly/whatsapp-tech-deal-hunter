import React from 'react';
import { Laptop, Smartphone, ShieldCheck } from 'lucide-react';

interface CategoryTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: string[];
  categoryCounts: { [key: string]: number };
  verificationCount: number;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  setActiveTab,
  categories,
  categoryCounts,
  verificationCount,
}) => {
  const getTabIcon = (cat: string) => {
    switch (cat) {
      case 'MacBook Series':
        return <Laptop className="w-4 h-4 text-sky-400" />;
      case 'iPhones':
        return <Smartphone className="w-4 h-4 text-purple-400" />;
      case 'Other Mobiles':
        return <Smartphone className="w-4 h-4 text-[#25D366]" />;
      case 'HP Spectre & HP Laptops':
        return <Laptop className="w-4 h-4 text-amber-400" />;
      case 'General Laptops':
        return <Laptop className="w-4 h-4 text-rose-400" />;
      default:
        return <Laptop className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none mb-6">
      <div className="flex items-center gap-2 min-w-max p-1.5 rounded-full bg-[#111B21] border border-[#222D34] shadow-md">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-normal transition-all duration-200 border ${
                isActive
                  ? 'bg-[#005C4B] text-[#25D366] border-[#25D366]/40 shadow-sm'
                  : 'bg-[#202C33] text-[#8696A0] border-[#222D34] hover:text-[#E9EDEF] hover:bg-[#2A3942]'
              }`}
            >
              {getTabIcon(cat)}
              <span>{cat}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-normal ${
                  isActive
                    ? 'bg-[#25D366]/20 text-[#25D366]'
                    : 'bg-[#111B21] text-[#8696A0]'
                }`}
              >
                {categoryCounts[cat] || 0}
              </span>
            </button>
          );
        })}

        {/* Dedicated Buyer Verification Tab */}
        <button
          onClick={() => setActiveTab('VERIFICATION_QUEUE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-normal transition-all duration-200 ml-2 border ${
            activeTab === 'VERIFICATION_QUEUE'
              ? 'bg-[#005C4B] text-[#25D366] border-[#25D366]/50 shadow-sm'
              : 'bg-[#202C33] text-[#25D366] border-[#222D34] hover:bg-[#2A3942]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#25D366]" />
          <span>Buyer Trust & Seller Legitimacy</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-normal ${
              activeTab === 'VERIFICATION_QUEUE'
                ? 'bg-[#25D366]/20 text-[#25D366]'
                : 'bg-[#111B21] text-[#25D366]'
            }`}
          >
            {verificationCount}
          </span>
        </button>
      </div>
    </div>
  );
};
