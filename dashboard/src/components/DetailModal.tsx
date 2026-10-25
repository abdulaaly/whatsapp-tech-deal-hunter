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
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111B21]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#202C33] w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[24px] p-6 lg:p-8 border border-[#222D34] shadow-2xl relative text-[#E9EDEF]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#111B21] hover:bg-[#2A3942] text-[#8696A0] hover:text-white flex items-center justify-center transition-colors border border-[#222D34]"
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
              <span className="text-[10px] uppercase font-normal tracking-wider px-3 py-0.5 rounded-full bg-[#005C4B] text-[#25D366] border border-[#25D366]/30">
                {item.category}
              </span>
              <span className="text-amber-400 font-normal text-xs">
                Overall: {item.star_ratings.value_score} ⭐
              </span>
              {item.duplicate_count > 1 && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {item.duplicate_count} Group Cross-Posts Tracked
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-normal text-[#E9EDEF] mt-1.5">
              {item.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="text-[#25D366] font-normal text-xl">
                Best Lot Price: PKR {item.best_price.toLocaleString()}
              </div>
              {item.price_savings > 0 && (
                <div className="text-xs px-2.5 py-1 rounded-full bg-[#005C4B]/60 text-[#25D366] border border-[#25D366]/40 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Save PKR {item.price_savings.toLocaleString()} vs Max Price (PKR {item.max_price.toLocaleString()})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ranking Rationale Callout */}
        <div className="p-4 rounded-[18px] bg-[#111B21] border border-[#00A884]/40 text-xs text-[#D1D7DB] mb-6 flex items-start gap-3">
          <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-[#25D366] font-normal text-sm mb-0.5">
              Why Ranked #{item.recommendation_rank} • {item.rank_badge}
            </div>
            <p className="leading-relaxed text-[#8696A0]">{item.verdict}</p>
          </div>
        </div>

        {/* Section 1: Multi-Group Cross-Post Tracking & Duplicate Price Comparison */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-normal text-[#E9EDEF] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#25D366]" />
              <span>Multi-Group Cross-Post & Seller Price Variations ({item.cross_group_posts.length} Sellers)</span>
            </h4>
            <span className="text-[11px] text-[#8696A0]">
              Real-time matching across Quetta, Karachi & Lahore
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
                      ? 'bg-[#111B21] border-[#25D366]/60 shadow-lg shadow-[#25D366]/10' 
                      : 'bg-[#111B21]/60 border-[#222D34]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-[#E9EDEF] font-normal">
                          {post.seller_name}
                        </span>
                        <span className="text-xs text-[#8696A0] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#8696A0]" />
                          {post.seller_phone}
                        </span>
                        {post.is_lowest_price ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#005C4B] text-[#25D366] border border-[#25D366]/40 flex items-center gap-1">
                            <CheckCheck className="w-3 h-3 text-[#25D366]" />
                            ⭐ CHEAPEST LOT OFFER
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A3942] text-[#8696A0]">
                            +PKR {priceDelta.toLocaleString()} higher
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#00A884] flex items-center gap-1 mt-0.5">
                        <Store className="w-3 h-3" />
                        <span>{post.seller_shop}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-base font-normal ${post.is_lowest_price ? 'text-[#25D366]' : 'text-[#E9EDEF]'}`}>
                        PKR {post.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#8696A0]">
                        {post.group_name}
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Raw Message Bubble */}
                  <div className="mt-2.5 p-3 rounded-[16px] bg-[#202C33] border border-[#222D34] text-xs font-mono text-[#D1D7DB] whitespace-pre-wrap leading-relaxed relative">
                    <div className="text-[10px] uppercase font-sans text-[#8696A0] mb-1 flex items-center justify-between">
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
                          : 'bg-[#2A3942] hover:bg-[#32424c] text-[#E9EDEF]'
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
        <h4 className="text-sm font-normal text-[#E9EDEF] mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#00A884]" />
          <span>Detailed Hardware Architecture & Benchmarks</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
          {/* CPU & Benchmarks */}
          <div className="p-4 rounded-[20px] bg-[#111B21] border border-[#222D34] space-y-2">
            <div className="flex items-center gap-2 text-[#00A884]">
              <Cpu className="w-4 h-4" />
              <span>Processor & Microarchitecture</span>
            </div>
            <div className="text-[#E9EDEF]">{item.processor}</div>
            <div className="text-amber-300">Rating: {item.star_ratings.chip_tier} ⭐</div>
            <div className="pt-2 border-t border-[#222D34] grid grid-cols-2 gap-2 text-[11px] text-[#8696A0]">
              <div>Geekbench 6 Single: <span className="text-[#E9EDEF]">{item.benchmarks.geekbench_single?.toLocaleString() || 'N/A'}</span></div>
              <div>Geekbench 6 Multi: <span className="text-[#E9EDEF]">{item.benchmarks.geekbench_multi?.toLocaleString() || 'N/A'}</span></div>
              {item.benchmarks.gpu_metal && (
                <div>Metal GPU: <span className="text-[#E9EDEF]">{item.benchmarks.gpu_metal.toLocaleString()}</span></div>
              )}
              {item.benchmarks.tdp_watts && (
                <div>TDP Envelope: <span className="text-[#E9EDEF]">{item.benchmarks.tdp_watts}W</span></div>
              )}
            </div>
          </div>

          {/* RAM & Storage */}
          <div className="p-4 rounded-[20px] bg-[#111B21] border border-[#222D34] space-y-2">
            <div className="flex items-center gap-2 text-sky-400">
              <HardDrive className="w-4 h-4" />
              <span>Memory & Storage Bus</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8696A0]">Memory:</span>
              <span className="text-[#E9EDEF]">{item.ram}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8696A0]">Storage:</span>
              <span className="text-[#E9EDEF]">{item.storage}</span>
            </div>
            <div className="flex justify-between text-amber-300">
              <span>Ratings:</span>
              <span>RAM: {item.star_ratings.ram} ⭐ | SSD: {item.star_ratings.storage} ⭐</span>
            </div>
          </div>

          {/* Display & Ports */}
          <div className="p-4 rounded-[20px] bg-[#111B21] border border-[#222D34] space-y-2">
            <div className="flex items-center gap-2 text-sky-400">
              <Monitor className="w-4 h-4" />
              <span>Display & Ports</span>
            </div>
            <div className="text-[#E9EDEF]">{item.display}</div>
            <div className="text-[#8696A0] text-[11px] mt-1">{item.ports}</div>
            <div className="text-amber-300">Display Rating: {item.star_ratings.display} ⭐</div>
          </div>

          {/* Battery, Charger & Condition */}
          <div className="p-4 rounded-[20px] bg-[#111B21] border border-[#222D34] space-y-2">
            <div className="flex items-center gap-2 text-[#25D366]">
              <Battery className="w-4 h-4" />
              <span>Battery, Charger & Condition</span>
            </div>
            <div className="text-[#E9EDEF]">Battery: {item.battery_health}</div>
            <div className="text-[#8696A0] text-[11px]">Charger: {item.charger}</div>
            <div className="text-[#8696A0] text-[11px]">Condition: {item.condition}</div>
            <div className="text-amber-300">Battery & Ports Rating: {item.star_ratings.ports_battery} ⭐</div>
          </div>
        </div>

        {/* Modal Footer with Lowest Seller Direct WhatsApp Action */}
        <div className="pt-4 border-t border-[#222D34] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#8696A0]">
            <div>Verified Source: <strong className="text-[#E9EDEF]">{item.cross_group_posts[0].group_name}</strong></div>
            <div className="text-[11px] text-[#00A884]">
              Zero-Risk Read-Only Protocol • No spam messages will be sent automatically
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
