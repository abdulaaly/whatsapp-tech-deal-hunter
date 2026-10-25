import React from 'react';
import type { EnrichedTechProduct } from '../types';
import { 
  ArrowUpDown, 
  ExternalLink, 
  MessageSquare, 
  Award, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Battery, 
  Info, 
  Store,
  Layers,
  TrendingDown
} from 'lucide-react';

interface HardwareTableProps {
  category: string;
  items: EnrichedTechProduct[];
  searchQuery: string;
  showDuplicatesOnly: boolean;
  sortBy: string;
  setSortBy: (val: string) => void;
  onSelectItem: (item: EnrichedTechProduct) => void;
  currencySymbol?: string;
}

export const HardwareTable: React.FC<HardwareTableProps> = ({
  category,
  items,
  searchQuery,
  showDuplicatesOnly,
  sortBy,
  setSortBy,
  onSelectItem,
  currencySymbol = 'Rs.',
}) => {
  // Filter items based on search and duplicate toggle
  const filteredAndSortedItems = React.useMemo(() => {
    let result = [...items];

    if (showDuplicatesOnly) {
      result = result.filter((it) => it.duplicate_count > 1);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.processor.toLowerCase().includes(q) ||
          it.ram.toLowerCase().includes(q) ||
          it.storage.toLowerCase().includes(q) ||
          it.condition.toLowerCase().includes(q) ||
          it.best_price.toString().includes(q) ||
          it.cross_group_posts.some(
            (p) =>
              p.seller_name.toLowerCase().includes(q) ||
              p.group_name.toLowerCase().includes(q) ||
              p.seller_shop.toLowerCase().includes(q) ||
              p.seller_phone.includes(q)
          )
      );
    }

    // Sort items
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          return a.recommendation_rank - b.recommendation_rank;
        case 'price-asc':
          return a.best_price - b.best_price;
        case 'price-desc':
          return b.best_price - a.best_price;
        case 'savings':
          return b.price_savings - a.price_savings;
        case 'score':
          return b.star_ratings.value_score - a.star_ratings.value_score;
        case 'geekbench':
          return (b.benchmarks.geekbench_multi || 0) - (a.benchmarks.geekbench_multi || 0);
        default:
          return a.recommendation_rank - b.recommendation_rank;
      }
    });

    return result;
  }, [items, searchQuery, showDuplicatesOnly, sortBy]);

  const topPick = items.find((it) => it.recommendation_rank === 1);
  const bestSavingsPick = [...items].sort((a, b) => b.price_savings - a.price_savings)[0];

  return (
    <div className="space-y-6">
      {/* Category Overview & Multi-Group Insight Bento */}
      <div className="bg-[var(--wa-surface)] rounded-[25px] p-6 relative overflow-hidden border border-[var(--wa-border)] shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#005C4B]/20 text-[#25D366] border border-[#25D366]/30 font-normal">
                WhatsApp Market Intelligence
              </span>
              <span className="text-xs text-[var(--wa-ink-muted)]">
                {filteredAndSortedItems.length} Verified Items in {category}
              </span>
              {showDuplicatesOnly && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  Filtering Multi-Group Duplicates
                </span>
              )}
            </div>
            <h2 className="text-2xl font-normal text-[var(--wa-ink)] tracking-tight">
              {category} • Granular Spec Benchmark
            </h2>
            <p className="text-sm text-[var(--wa-ink-muted)] max-w-3xl mt-1 leading-relaxed">
              Every listing is cross-referenced across wholesale groups and trade broadcasts. Duplicates are matched to surface the lowest price lot seller.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {topPick && (
              <div 
                onClick={() => onSelectItem(topPick)}
                className="p-3.5 rounded-[20px] bg-[var(--wa-surface-subtle)] border border-[#25D366]/40 text-xs cursor-pointer hover:border-[#25D366] transition-all"
              >
                <div className="text-[#25D366] font-normal uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Top Recommended Pick
                </div>
                <div className="text-[var(--wa-ink)] font-normal text-sm mt-0.5 line-clamp-1">
                  {topPick.title}
                </div>
                <div className="text-[var(--wa-ink-muted)] text-[11px] mt-0.5">
                  {currencySymbol} {topPick.best_price.toLocaleString()} • {topPick.star_ratings.value_score} ⭐
                </div>
              </div>
            )}

            {bestSavingsPick && bestSavingsPick.price_savings > 0 && (
              <div 
                onClick={() => onSelectItem(bestSavingsPick)}
                className="p-3.5 rounded-[20px] bg-[var(--wa-surface-subtle)] border border-amber-500/40 text-xs cursor-pointer hover:border-amber-400 transition-all"
              >
                <div className="text-amber-500 font-normal uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                  Max Cross-Group Savings
                </div>
                <div className="text-[var(--wa-ink)] font-normal text-sm mt-0.5 line-clamp-1">
                  {bestSavingsPick.title}
                </div>
                <div className="text-[#25D366] text-[11px] mt-0.5">
                  Save {currencySymbol} {bestSavingsPick.price_savings.toLocaleString()} across groups
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Comparison Table */}
      <div className="bg-[var(--wa-surface)] rounded-[25px] overflow-hidden border border-[var(--wa-border)] shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-[var(--wa-surface-subtle)] border-b border-[var(--wa-border)] text-[11px] uppercase tracking-wider text-[var(--wa-ink-muted)] font-normal select-none">
                <th
                  onClick={() => setSortBy(sortBy === 'rank' ? 'price-asc' : 'rank')}
                  className="py-4 px-4 cursor-pointer hover:text-[var(--wa-ink)] transition-colors w-24"
                >
                  <div className="flex items-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-4 px-4 w-72">Device & Spec Ratings</th>
                <th
                  onClick={() => setSortBy(sortBy === 'price-asc' ? 'price-desc' : 'price-asc')}
                  className="py-4 px-4 cursor-pointer hover:text-[var(--wa-ink)] transition-colors w-48"
                >
                  <div className="flex items-center gap-1">
                    <span>Best Price & Savings</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-4 px-4 w-60">CPU Architecture</th>
                <th className="py-4 px-4 w-40">RAM Memory</th>
                <th className="py-4 px-4 w-36">SSD Storage</th>
                <th className="py-4 px-4 w-48">Display Panel</th>
                <th className="py-4 px-4 w-40">Battery Health</th>
                <th className="py-4 px-4 w-48">Condition & Lot Notes</th>
                <th className="py-4 px-4 w-64 text-right">Lowest Seller & WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--wa-border)] text-xs text-[var(--wa-ink)]">
              {filteredAndSortedItems.map((item) => {
                const isRankOne = item.recommendation_rank === 1;
                const lowestSeller = item.cross_group_posts.find((p) => p.is_lowest_price) || item.cross_group_posts[0];

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`cursor-pointer transition-all duration-150 hover:bg-[var(--wa-surface-subtle)] ${
                      isRankOne ? 'bg-[#005C4B]/10' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-normal text-xs ${
                            isRankOne
                              ? 'bg-[#25D366] text-[#111B21] shadow-md shadow-[#25D366]/30'
                              : 'bg-[var(--wa-surface-subtle)] text-[var(--wa-ink)] border border-[var(--wa-border)]'
                          }`}
                        >
                          #{item.recommendation_rank}
                        </span>
                      </div>
                    </td>

                    {/* Model & Overall Score */}
                    <td className="py-4 px-4">
                      <div className="font-normal text-sm text-[var(--wa-ink)] hover:text-[#25D366] transition-colors flex items-center gap-1.5">
                        {item.title}
                        <Info className="w-3.5 h-3.5 text-[var(--wa-ink-muted)] opacity-60 hover:opacity-100" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-amber-500 font-normal text-xs">
                          {item.star_ratings.value_score} ⭐ Overall
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--wa-surface-subtle)] text-[var(--wa-ink-muted)] border border-[var(--wa-border)]">
                          {item.rank_badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--wa-ink-muted)] mt-1 line-clamp-1 italic">
                        {item.verdict}
                      </p>
                    </td>

                    {/* Price / Cross-Group Savings */}
                    <td className="py-4 px-4">
                      <div className="text-sm font-normal text-[#25D366]">
                        {currencySymbol} {item.best_price.toLocaleString()}
                      </div>
                      {item.duplicate_count > 1 ? (
                        <div className="mt-1 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Layers className="w-2.5 h-2.5" />
                              {item.duplicate_count} Group Posts
                            </span>
                          </div>
                          {item.price_savings > 0 && (
                            <div className="text-[10px] text-[var(--wa-ink-muted)]">
                              Save up to <span className="text-[#25D366] font-normal">{currencySymbol} {item.price_savings.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--wa-ink-muted)]">Single Group Post</span>
                      )}
                    </td>

                    {/* Processor */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-[var(--wa-ink)]">
                        <Cpu className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                        <span className="line-clamp-2">{item.processor}</span>
                      </div>
                      <div className="text-[10px] text-[var(--wa-ink-muted)] mt-0.5">
                        Tier Rating: {'⭐'.repeat(item.star_ratings.chip_tier)}
                      </div>
                    </td>

                    {/* RAM */}
                    <td className="py-4 px-4">
                      <div className="text-[var(--wa-ink)] font-normal">{item.ram}</div>
                      <div className="text-[10px] text-[var(--wa-ink-muted)]">
                        {'⭐'.repeat(item.star_ratings.ram)}
                      </div>
                    </td>

                    {/* Storage */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-[var(--wa-ink)]">
                        <HardDrive className="w-3 h-3 text-[var(--wa-ink-muted)] shrink-0" />
                        <span className="line-clamp-1">{item.storage}</span>
                      </div>
                      <div className="text-[10px] text-[var(--wa-ink-muted)]">
                        {'⭐'.repeat(item.star_ratings.storage)}
                      </div>
                    </td>

                    {/* Display */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-[var(--wa-ink)]">
                        <Monitor className="w-3 h-3 text-[var(--wa-ink-muted)] shrink-0" />
                        <span className="line-clamp-2">{item.display}</span>
                      </div>
                      <div className="text-[10px] text-[var(--wa-ink-muted)]">
                        {'⭐'.repeat(item.star_ratings.display)}
                      </div>
                    </td>

                    {/* Battery */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-[var(--wa-ink)]">
                        <Battery className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                        <span>{item.battery_health}</span>
                      </div>
                      <div className="text-[10px] text-[var(--wa-ink-muted)]">
                        Charger: {item.charger}
                      </div>
                    </td>

                    {/* Condition & Lot notes */}
                    <td className="py-4 px-4">
                      <div className="text-[var(--wa-ink)]">{item.condition}</div>
                      <div className="text-[10px] text-[var(--wa-ink-muted)] mt-0.5">
                        {item.warranty}
                      </div>
                    </td>

                    {/* Lowest Price Seller & Direct WhatsApp Action */}
                    <td className="py-4 px-4 text-right">
                      {lowestSeller && (
                        <div>
                          <div className="font-normal text-[var(--wa-ink)] text-xs flex items-center justify-end gap-1">
                            <Store className="w-3 h-3 text-[#25D366]" />
                            <span>{lowestSeller.seller_name}</span>
                          </div>
                          <div className="text-[10px] text-[var(--wa-ink-muted)] line-clamp-1">
                            {lowestSeller.group_name}
                          </div>
                          <div className="mt-2 flex items-center justify-end gap-1.5">
                            <a
                              href={lowestSeller.whatsapp_link}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#25D366] text-[#111B21] text-xs font-normal hover:bg-[#20ba5a] shadow-xs shadow-[#25D366]/20 transition-all"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>wa.me</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
                            </a>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
