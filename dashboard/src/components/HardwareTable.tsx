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
  Phone,
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
}

export const HardwareTable: React.FC<HardwareTableProps> = ({
  category,
  items,
  searchQuery,
  showDuplicatesOnly,
  sortBy,
  setSortBy,
  onSelectItem,
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
      <div className="bg-[#202C33] rounded-[24px] p-6 relative overflow-hidden border border-[#222D34] shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00A884]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#005C4B]/60 text-[#25D366] border border-[#25D366]/30 font-normal">
                WhatsApp Market Intelligence
              </span>
              <span className="text-xs text-[#8696A0]">
                {filteredAndSortedItems.length} Verified Models in {category}
              </span>
              {showDuplicatesOnly && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Filtering Multi-Group Duplicates
                </span>
              )}
            </div>
            <h2 className="text-2xl font-normal text-[#E9EDEF] tracking-tight">
              {category} • Granular Spec Benchmark
            </h2>
            <p className="text-sm text-[#8696A0] max-w-3xl mt-1 leading-relaxed">
              Every listing is cross-referenced across Quetta Godam, Saddar Karachi, and Hafeez Center Lahore WhatsApp groups. Duplicates are matched to surface the lowest price lot seller.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {topPick && (
              <div 
                onClick={() => onSelectItem(topPick)}
                className="p-3.5 rounded-[20px] bg-[#111B21] border border-[#00A884]/40 text-xs cursor-pointer hover:border-[#25D366] transition-all"
              >
                <div className="text-[#25D366] font-normal uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Top Recommended Pick
                </div>
                <div className="text-[#E9EDEF] font-normal text-sm mt-0.5 line-clamp-1">
                  {topPick.title}
                </div>
                <div className="text-[#8696A0] text-[11px] mt-0.5">
                  PKR {topPick.best_price.toLocaleString()} • {topPick.star_ratings.value_score} ⭐
                </div>
              </div>
            )}

            {bestSavingsPick && bestSavingsPick.price_savings > 0 && (
              <div 
                onClick={() => onSelectItem(bestSavingsPick)}
                className="p-3.5 rounded-[20px] bg-[#111B21] border border-amber-500/40 text-xs cursor-pointer hover:border-amber-400 transition-all"
              >
                <div className="text-amber-400 font-normal uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                  Max Cross-Group Savings
                </div>
                <div className="text-[#E9EDEF] font-normal text-sm mt-0.5 line-clamp-1">
                  {bestSavingsPick.title}
                </div>
                <div className="text-[#25D366] text-[11px] mt-0.5">
                  Save PKR {bestSavingsPick.price_savings.toLocaleString()} across groups
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Comparison Table */}
      <div className="bg-[#202C33] rounded-[24px] overflow-hidden border border-[#222D34] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-[#111B21] border-b border-[#222D34] text-[11px] uppercase tracking-wider text-[#8696A0] font-normal select-none">
                <th
                  onClick={() => setSortBy(sortBy === 'rank' ? 'price-asc' : 'rank')}
                  className="py-4 px-4 cursor-pointer hover:text-white transition-colors w-24"
                >
                  <div className="flex items-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-4 px-4 w-72">Device & Spec Ratings</th>
                <th
                  onClick={() => setSortBy(sortBy === 'price-asc' ? 'price-desc' : 'price-asc')}
                  className="py-4 px-4 cursor-pointer hover:text-white transition-colors w-48"
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
            <tbody className="divide-y divide-[#222D34] text-xs text-[#D1D7DB]">
              {filteredAndSortedItems.map((item) => {
                const isRankOne = item.recommendation_rank === 1;
                const lowestSeller = item.cross_group_posts.find((p) => p.is_lowest_price) || item.cross_group_posts[0];

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`cursor-pointer transition-all duration-150 hover:bg-[#2A3942]/50 ${
                      isRankOne ? 'bg-[#005C4B]/15' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-normal text-xs ${
                            isRankOne
                              ? 'bg-[#25D366] text-[#111B21] shadow-md shadow-[#25D366]/30'
                              : 'bg-[#111B21] text-[#E9EDEF] border border-[#222D34]'
                          }`}
                        >
                          #{item.recommendation_rank}
                        </span>
                      </div>
                    </td>

                    {/* Model & Overall Score */}
                    <td className="py-4 px-4">
                      <div className="font-normal text-sm text-[#E9EDEF] hover:text-[#25D366] transition-colors flex items-center gap-1.5">
                        {item.title}
                        <Info className="w-3.5 h-3.5 text-[#8696A0] opacity-60 hover:opacity-100" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-amber-400 font-normal text-xs">
                          {item.star_ratings.value_score} ⭐ Overall
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#111B21] text-[#8696A0] border border-[#222D34]">
                          {item.rank_badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8696A0] mt-1 line-clamp-1 italic">
                        {item.verdict}
                      </p>
                    </td>

                    {/* Price / Cross-Group Savings */}
                    <td className="py-4 px-4">
                      <div className="text-sm font-normal text-[#25D366]">
                        PKR {item.best_price.toLocaleString()}
                      </div>
                      {item.duplicate_count > 1 ? (
                        <div className="mt-1 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Layers className="w-2.5 h-2.5" />
                              {item.duplicate_count} Group Posts
                            </span>
                          </div>
                          {item.price_savings > 0 && (
                            <div className="text-[10px] text-[#25D366] flex items-center gap-1">
                              <TrendingDown className="w-3 h-3 text-[#25D366]" />
                              <span>Save PKR {item.price_savings.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="text-[10px] text-[#8696A0]">
                            Spread: Up to PKR {item.max_price.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#8696A0] block mt-0.5">
                          Exclusive Single Post
                        </span>
                      )}
                    </td>

                    {/* CPU & Architecture */}
                    <td className="py-4 px-4">
                      <div className="font-normal text-[#E9EDEF] flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-[#00A884] shrink-0" />
                        <span className="line-clamp-1">{item.processor}</span>
                      </div>
                      <div className="text-[11px] text-amber-300 mt-0.5">
                        Tier: {item.star_ratings.chip_tier} ⭐
                      </div>
                      <div className="text-[10px] text-[#8696A0] mt-0.5">
                        GB6 Multi: <span className="text-[#E9EDEF]">{item.benchmarks.geekbench_multi?.toLocaleString() || 'N/A'}</span>
                      </div>
                    </td>

                    {/* RAM */}
                    <td className="py-4 px-4">
                      <div className="font-normal text-[#E9EDEF] line-clamp-1">
                        {item.ram}
                      </div>
                      <div className="text-[11px] text-amber-300 mt-0.5">
                        {item.star_ratings.ram} ⭐
                      </div>
                    </td>

                    {/* Storage */}
                    <td className="py-4 px-4">
                      <div className="font-normal text-[#E9EDEF] flex items-center gap-1">
                        <HardDrive className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span className="line-clamp-1">{item.storage}</span>
                      </div>
                      <div className="text-[11px] text-amber-300 mt-0.5">
                        {item.star_ratings.storage} ⭐
                      </div>
                    </td>

                    {/* Display */}
                    <td className="py-4 px-4">
                      <div className="text-[#E9EDEF] font-normal flex items-center gap-1 line-clamp-1">
                        <Monitor className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{item.display}</span>
                      </div>
                      <div className="text-[11px] text-amber-300 mt-0.5">
                        {item.star_ratings.display} ⭐
                      </div>
                    </td>

                    {/* Battery */}
                    <td className="py-4 px-4">
                      <div className="text-[#E9EDEF] font-normal flex items-center gap-1">
                        <Battery className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                        <span>{item.battery_health}</span>
                      </div>
                      <div className="text-[11px] text-amber-300 mt-0.5">
                        {item.star_ratings.ports_battery} ⭐
                      </div>
                    </td>

                    {/* Condition & Lot Notes */}
                    <td className="py-4 px-4">
                      <div className="text-[#D1D7DB] line-clamp-2">
                        {item.condition}
                      </div>
                      <div className="text-[10px] text-[#8696A0] mt-0.5">
                        Warranty: {item.warranty}
                      </div>
                    </td>

                    {/* Lowest Seller & WhatsApp Direct */}
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="font-normal text-[#E9EDEF] text-sm">
                        {lowestSeller.seller_name}
                      </div>
                      <div className="text-[11px] text-[#8696A0] flex items-center justify-end gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#8696A0]" />
                        <span>{lowestSeller.seller_phone}</span>
                      </div>
                      <div className="text-[10px] text-[#00A884] flex items-center justify-end gap-1 mt-0.5 line-clamp-1">
                        <Store className="w-3 h-3 shrink-0" />
                        <span>{lowestSeller.seller_shop}</span>
                      </div>

                      {/* Source group tag */}
                      <div className="text-[10px] text-[#8696A0] mt-1 line-clamp-1">
                        {lowestSeller.group_name}
                      </div>

                      {/* 1-Click WhatsApp Direct Chat */}
                      <a
                        href={lowestSeller.whatsapp_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mt-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-[#111B21] font-normal text-xs transition-colors shadow-lg shadow-[#25D366]/20"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-[#111B21]" />
                        <span>WhatsApp Best Deal</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
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
