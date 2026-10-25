import React from 'react';
import { Laptop, Smartphone, ShieldCheck, Tag } from 'lucide-react';

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
    const low = cat.toLowerCase();
    if (low.includes('macbook') || low.includes('laptop') || low.includes('spectre') || low.includes('xps') || low.includes('inverter')) {
      return <Laptop className="w-4 h-4 text-[#25D366]" />;
    } else if (low.includes('phone') || low.includes('iphone') || low.includes('mobile')) {
      return <Smartphone className="w-4 h-4 text-[#25D366]" />;
    }
    return <Tag className="w-4 h-4 text-[#25D366]" />;
  };

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none mb-6">
      <div className="flex items-center gap-2 min-w-max p-1.5 rounded-full bg-[var(--wa-surface)] border border-[var(--wa-border)] shadow-xs">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-normal transition-all duration-200 border cursor-pointer ${
                isActive
                  ? 'bg-[#25D366] text-[#111B21] border-[#25D366] shadow-sm'
                  : 'bg-[var(--wa-surface-subtle)] text-[var(--wa-ink-muted)] border-[var(--wa-border)] hover:text-[var(--wa-ink)] hover:border-[#25D366]/40'
              }`}
            >
              {getTabIcon(cat)}
              <span>{cat}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-normal ${
                  isActive
                    ? 'bg-[#111B21]/15 text-[#111B21]'
                    : 'bg-[var(--wa-surface)] text-[var(--wa-ink-muted)]'
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
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-normal transition-all duration-200 ml-2 border cursor-pointer ${
            activeTab === 'VERIFICATION_QUEUE'
              ? 'bg-[#25D366] text-[#111B21] border-[#25D366] shadow-sm'
              : 'bg-[var(--wa-surface-subtle)] text-[var(--wa-ink-muted)] border-[var(--wa-border)] hover:text-[var(--wa-ink)] hover:border-[#25D366]/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#25D366]" />
          <span>Buyer Verification Audit</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-normal ${
              activeTab === 'VERIFICATION_QUEUE'
                ? 'bg-[#111B21]/15 text-[#111B21]'
                : 'bg-[var(--wa-surface)] text-[#25D366]'
            }`}
          >
            {verificationCount} Verified
          </span>
        </button>
      </div>
    </div>
  );
};
