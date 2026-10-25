import React from 'react';
import type { EnrichedTechProduct } from '../types';
import { 
  X, 
  Cpu, 
  HardDrive, 
  Monitor, 
  Battery, 
  ExternalLink, 
  MessageSquare, 
  Award, 
  Store, 
  Phone, 
  Layers, 
  CheckCheck, 
  TrendingDown 
} from 'lucide-react';

interface DetailModalProps {
  item: EnrichedTechProduct | null;
  onClose: () => void;
  currencySymbol?: string;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose, currencySymbol = 'Rs.' }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[var(--wa-surface)] w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[25px] p-6 lg:p-8 border border-[var(--wa-border)] shadow-2xl relative text-[var(--wa-ink)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[var(--wa-surface-subtle)] hover:bg-[var(--wa-border)] text-[var(--wa-ink-muted)] hover:text-[var(--wa-ink)] flex items-center justify-center transition-colors border border-[var(--wa-border)]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 pr-10">
          <div className="w-12 h-12 rounded-full bg-[#25D366] text-[#111B21] flex items-center justify-center font-normal text-xl shrink-0 shadow-lg shadow-[#25D366]/20">
            #{item.recommendation_rank}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-normal tracking-wider px-3 py-0.5 rounded-full bg-[#005C4B]/20 text-[#25D366] border border-[#25D366]/30">
                {item.category}
              </span>
              <span className="text-amber-500 font-normal text-xs">
                Overall: {item.star_ratings.value_score} ⭐
              </span>
              {item.duplicate_count > 1 && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {item.duplicate_count} Group Cross-Posts Tracked
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-normal text-[var(--wa-ink)] mt-1.5">
              {item.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="text-[#25D366] font-normal text-xl">
                Best Lot Price: {currencySymbol} {item.best_price.toLocaleString()}
              </div>
              {item.price_savings > 0 && (
                <div className="text-xs px-2.5 py-1 rounded-full bg-[#005C4B]/20 text-[#25D366] border border-[#25D366]/40 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Save {currencySymbol} {item.price_savings.toLocaleString()} vs Max Price ({currencySymbol} {item.max_price.toLocaleString()})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ranking Rationale Callout */}
        <div className="p-4 rounded-[20px] bg-[var(--wa-surface-subtle)] border border-[#25D366]/40 text-xs text-[var(--wa-ink)] mb-6 flex items-start gap-3">
          <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-[#25D366] font-normal text-sm mb-0.5">
              Why Ranked #{item.recommendation_rank} • {item.rank_badge}
            </div>
            <p className="leading-relaxed text-[var(--wa-ink-muted)]">{item.verdict}</p>
          </div>
        </div>

        {/* Section 1: Multi-Group Cross-Post Tracking & Duplicate Price Comparison */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-normal text-[var(--wa-ink)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#25D366]" />
              <span>Multi-Group Cross-Post & Seller Price Variations ({item.cross_group_posts.length} Sellers)</span>
            </h4>
            <span className="text-[11px] text-[var(--wa-ink-muted)]">
              Real-time matching across trade groups
            </span>
          </div>

          <div className="space-y-3">
            {item.cross_group_posts.map((post, idx) => {
              const priceDelta = post.price - item.best_price;
              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-[20px] border transition-all ${
                    post.is_lowest_price 
                      ? 'bg-[var(--wa-surface-subtle)] border-[#25D366]/60 shadow-lg shadow-[#25D366]/10' 
                      : 'bg-[var(--wa-surface-subtle)]/60 border-[var(--wa-border)]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-[var(--wa-ink)] font-normal">
                          {post.seller_name}
                        </span>
                        <span className="text-xs text-[var(--wa-ink-muted)] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[var(--wa-ink-muted)]" />
                          {post.seller_phone}
                        </span>
                        {post.is_lowest_price ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#005C4B]/20 text-[#25D366] border border-[#25D366]/40 flex items-center gap-1">
                            <CheckCheck className="w-3 h-3 text-[#25D366]" />
                            ⭐ CHEAPEST LOT OFFER
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--wa-surface)] text-[var(--wa-ink-muted)]">
                            +{currencySymbol} {priceDelta.toLocaleString()} higher
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#25D366] flex items-center gap-1 mt-0.5">
                        <Store className="w-3 h-3" />
                        <span>{post.seller_shop}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-base font-normal ${post.is_lowest_price ? 'text-[#25D366]' : 'text-[var(--wa-ink)]'}`}>
                        {currencySymbol} {post.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[var(--wa-ink-muted)]">
                        {post.group_name}
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Raw Message Bubble */}
                  <div className="mt-2.5 p-3 rounded-[16px] bg-[var(--wa-surface)] border border-[var(--wa-border)] text-xs font-mono text-[var(--wa-ink)] whitespace-pre-wrap leading-relaxed relative">
                    <div className="text-[10px] uppercase font-sans text-[var(--wa-ink-muted)] mb-1 flex items-center justify-between">
                      <span>Original WhatsApp Broadcast • Msg: {post.message_id}</span>
                      <span>{post.timestamp}</span>
                    </div>
                    {post.raw_snippet}
                  </div>

                  {/* Action Link for this specific seller */}
                  <div className="mt-3 flex items-center justify-end">
                    <a
                      href={post.whatsapp_link}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-normal transition-all ${
                        post.is_lowest_price
                          ? 'bg-[#25D366] hover:bg-[#20ba5a] text-[#111B21] shadow-md shadow-[#25D366]/20'
                          : 'bg-[var(--wa-surface)] hover:bg-[var(--wa-border)] text-[var(--wa-ink)] border border-[var(--wa-border)]'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact {post.seller_name} on WhatsApp</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Hardware Specifications & Benchmarks */}
        <h4 className="text-sm font-normal text-[var(--wa-ink)] mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#25D366]" />
          <span>Detailed Architecture & Benchmarks</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
          {/* CPU & Benchmarks */}
          <div className="p-4 rounded-[20px] bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] space-y-2">
            <div className="flex items-center gap-2 text-[#25D366]">
              <Cpu className="w-4 h-4" />
              <span>Processor & Architecture</span>
            </div>
            <div className="text-[var(--wa-ink)]">{item.processor}</div>
            <div className="text-amber-500">Rating: {item.star_ratings.chip_tier} ⭐</div>
            <div className="pt-2 border-t border-[var(--wa-border)] grid grid-cols-2 gap-2 text-[11px] text-[var(--wa-ink-muted)]">
              <div>Geekbench 6 Single: <span className="text-[var(--wa-ink)]">{item.benchmarks.geekbench_single?.toLocaleString() || 'N/A'}</span></div>
              <div>Geekbench 6 Multi: <span className="text-[var(--wa-ink)]">{item.benchmarks.geekbench_multi?.toLocaleString() || 'N/A'}</span></div>
              {item.benchmarks.gpu_metal && (
                <div>Metal GPU: <span className="text-[var(--wa-ink)]">{item.benchmarks.gpu_metal.toLocaleString()}</span></div>
              )}
              {item.benchmarks.tdp_watts && (
                <div>TDP Envelope: <span className="text-[var(--wa-ink)]">{item.benchmarks.tdp_watts}W</span></div>
              )}
            </div>
          </div>

          {/* RAM & Storage */}
          <div className="p-4 rounded-[20px] bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] space-y-2">
            <div className="flex items-center gap-2 text-sky-500">
              <HardDrive className="w-4 h-4" />
              <span>Memory & Storage Bus</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--wa-ink-muted)]">Memory:</span>
              <span className="text-[var(--wa-ink)]">{item.ram}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--wa-ink-muted)]">Storage:</span>
              <span className="text-[var(--wa-ink)]">{item.storage}</span>
            </div>
            <div className="flex justify-between text-amber-500">
              <span>Ratings:</span>
              <span>RAM: {item.star_ratings.ram} ⭐ | SSD: {item.star_ratings.storage} ⭐</span>
            </div>
          </div>

          {/* Display & Ports */}
          <div className="p-4 rounded-[20px] bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] space-y-2">
            <div className="flex items-center gap-2 text-purple-500">
              <Monitor className="w-4 h-4" />
              <span>Display & Ports</span>
            </div>
            <div className="text-[var(--wa-ink)]">{item.display}</div>
            <div className="text-[var(--wa-ink-muted)] text-[11px] mt-1">{item.ports}</div>
            <div className="text-amber-500">Display Rating: {item.star_ratings.display} ⭐</div>
          </div>

          {/* Battery, Charger & Condition */}
          <div className="p-4 rounded-[20px] bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] space-y-2">
            <div className="flex items-center gap-2 text-[#25D366]">
              <Battery className="w-4 h-4" />
              <span>Battery, Charger & Condition</span>
            </div>
            <div className="text-[var(--wa-ink)]">Battery: {item.battery_health}</div>
            <div className="text-[var(--wa-ink-muted)] text-[11px]">Charger: {item.charger}</div>
            <div className="text-[var(--wa-ink-muted)] text-[11px]">Condition: {item.condition}</div>
            <div className="text-amber-500">Battery & Ports Rating: {item.star_ratings.ports_battery} ⭐</div>
          </div>
        </div>

        {/* Modal Footer with Lowest Seller Direct WhatsApp Action */}
        <div className="pt-4 border-t border-[var(--wa-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[var(--wa-ink-muted)]">
            <div>Verified Source: <strong className="text-[var(--wa-ink)]">{item.cross_group_posts[0].group_name}</strong></div>
            <div className="text-[11px] text-[#25D366]">
              Zero-Risk Read-Only Protocol • No automated spam messages
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={item.cross_group_posts.find((p) => p.is_lowest_price)?.whatsapp_link || item.cross_group_posts[0].whatsapp_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-[#111B21] font-normal text-xs transition-colors shadow-lg shadow-[#25D366]/20"
            >
              <MessageSquare className="w-4 h-4 fill-[#111B21]" />
              <span>Inquire on WhatsApp (Best Deal)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
