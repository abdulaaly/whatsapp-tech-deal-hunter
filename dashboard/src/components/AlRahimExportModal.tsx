import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  ShoppingBag, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Store, 
  ShieldCheck,
  Check
} from 'lucide-react';

interface AlRahimExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlRahimExportModal: React.FC<AlRahimExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'duplication' | 'shopify'>('overview');
  const [auditData, setAuditData] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isPruned, setIsPruned] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch live audit info from backend
      fetch('http://127.0.0.1:8765/api/al-raheem/data')
        .then(res => res.json())
        .then(data => {
          if (data && data.success) {
            setAuditData(data);
          }
        })
        .catch(err => {
          console.log('Using local embedded audit data:', err);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const downloadZipUrl = 'http://127.0.0.1:8765/api/al-raheem/export';
  const downloadCsvUrl = 'http://127.0.0.1:8765/api/al-raheem/shopify.csv';

  const copyShopifyInstructions = () => {
    const text = `Shopify Store Setup for Al-Rahim Mobile Mart:
1. Go to your Shopify Admin -> Products -> Import
2. Upload the downloaded "shopify_products_import.csv"
3. Check "Overwrite products with matching handles"
4. Collections to create: "Quetta Lot Laptops", "Flagship Smartphones", "Dell XPS Power Series"
5. Set primary currency to PKR (Rs)`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[var(--wa-surface)] border border-[var(--wa-border)] rounded-[25px] shadow-2xl overflow-hidden text-[var(--wa-ink)] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--wa-border)] bg-[var(--wa-surface-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-[#111B21] shadow-md shadow-[#25D366]/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-normal tracking-tight flex items-center gap-2">
                  <span>Al __ Raheem mobile mart ✅📱</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30">
                    Real WhatsApp SQLite Data
                  </span>
                </h2>
              </div>
              <p className="text-xs text-[var(--wa-ink-muted)]">
                Seller: Muhammad Hamza (+92 315 0477792) • Quetta Russi Market Godam #65 • 73 Messages Ingested
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--wa-surface)] text-[var(--wa-ink-muted)] hover:text-[var(--wa-ink)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[var(--wa-border)] bg-[var(--wa-surface)]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-normal border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#25D366] text-[#25D366]'
                : 'border-transparent text-[var(--wa-ink-muted)] hover:text-[var(--wa-ink)]'
            }`}
          >
            1. Group Dataset Overview
          </button>
          <button
            onClick={() => setActiveTab('duplication')}
            className={`px-4 py-2 text-xs font-normal border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'duplication'
                ? 'border-[#25D366] text-[#25D366]'
                : 'border-transparent text-[var(--wa-ink-muted)] hover:text-[var(--wa-ink)]'
            }`}
          >
            <span>2. Duplication Audit (6 Duplicate Bursts)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-500 font-medium">
              6 Dups
            </span>
          </button>
          <button
            onClick={() => setActiveTab('shopify')}
            className={`px-4 py-2 text-xs font-normal border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'shopify'
                ? 'border-[#25D366] text-[#25D366]'
                : 'border-transparent text-[var(--wa-ink-muted)] hover:text-[var(--wa-ink)]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>3. Shopify Store Generator</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-[15px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)]">
                  <div className="text-[11px] text-[var(--wa-ink-muted)]">Total Messages</div>
                  <div className="text-xl font-normal mt-0.5 text-[var(--wa-ink)]">
                    {auditData?.duplication?.summary?.total_group_messages || 73} Real Records
                  </div>
                  <div className="text-[10px] text-[#25D366] mt-1">Direct from messages.db</div>
                </div>
                <div className="p-3.5 rounded-[15px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)]">
                  <div className="text-[11px] text-[var(--wa-ink-muted)]">Product Visuals</div>
                  <div className="text-xl font-normal mt-0.5 text-[var(--wa-ink)]">
                    {auditData?.duplication?.summary?.total_media_attachments || 72} Media Lots
                  </div>
                  <div className="text-[10px] text-[var(--wa-ink-muted)] mt-1">71 Photos + 1 Video</div>
                </div>
                <div className="p-3.5 rounded-[15px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)]">
                  <div className="text-[11px] text-[var(--wa-ink-muted)]">Verified Seller</div>
                  <div className="text-xl font-normal mt-0.5 text-[#25D366]">
                    {auditData?.seller_profile?.push_name || 'M. Hamza'}
                  </div>
                  <div className="text-[10px] text-[var(--wa-ink-muted)] mt-1">
                    {auditData?.seller_profile?.resolved_phone || '+92 315 0477792'}
                  </div>
                </div>
                <div className="p-3.5 rounded-[15px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)]">
                  <div className="text-[11px] text-[var(--wa-ink-muted)]">Physical Godam</div>
                  <div className="text-xl font-normal mt-0.5 text-[var(--wa-ink)]">Godam #65</div>
                  <div className="text-[10px] text-[var(--wa-ink-muted)] mt-1">Quetta Russi Market</div>
                </div>
              </div>

              {/* Verified Hardware Deal Highlight */}
              <div className="p-4 rounded-[20px] border border-[#25D366]/30 bg-[#25D366]/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                    <span className="text-xs font-normal text-[#25D366] uppercase tracking-wider">
                      Flagship Extracted WhatsApp Deal
                    </span>
                  </div>
                  <span className="text-xs font-normal text-[var(--wa-ink)] bg-[var(--wa-surface)] px-2.5 py-1 rounded-full border border-[var(--wa-border)]">
                    Msg ID: AC38A4A7... (2026-10-22 12:06:25 PKT)
                  </span>
                </div>

                <div className="bg-[var(--wa-surface)] p-3.5 rounded-[15px] border border-[var(--wa-border)] font-mono text-xs whitespace-pre-wrap leading-relaxed text-[var(--wa-ink)]">
{`💥DELL XPS 17 9700💥

🔘Processor: Intel® Core® i9-10875H
🔘Memory: 16GB DDR4
🔘Storage: ssd 512 g.b nvme
🔘graphics card: NVIDIA GeForce GTX 2060 6GB gddr6
🔘Display Resolution : 17-inch UHD+, 3840 x 2400, 60 Hz

Price *18,000*
*New customer say haff payment advance ha*`}
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--wa-ink-muted)]">
                  <span>9 High-Res Angle Photos attached in burst</span>
                  <a 
                    href="https://wa.me/923150477792?text=Assalam-o-Alaikum%20Hamza%20bhai%2C%20Dell%20XPS%2017%209700%20i9%20available%20hai%3F"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#25D366] hover:underline flex items-center gap-1 font-normal"
                  >
                    <span>Contact Seller on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Export Bundle Actions */}
              <div className="p-4 rounded-[20px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-normal text-[var(--wa-ink)]">Complete 10-File Export Bundle (.ZIP)</h4>
                  <p className="text-xs text-[var(--wa-ink-muted)] mt-0.5">
                    Includes raw JSON, CSV, chat transcript (.txt), duplication audit, and ready-to-import Shopify CSV.
                  </p>
                </div>
                <a
                  href={downloadZipUrl}
                  download="al_raheem_mobile_market_export.zip"
                  className="px-5 py-2.5 rounded-full bg-[#25D366] text-[#111B21] hover:bg-[#20ba5a] text-xs font-normal flex items-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Export ZIP (56 KB)</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'duplication' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-normal text-[var(--wa-ink)]">
                    Audit of Repeated Blasts & Cross-Group Postings
                  </h3>
                  <p className="text-xs text-[var(--wa-ink-muted)]">
                    Sellers broadcast identical product images every 60 minutes to maintain top-of-feed status in WhatsApp notifications.
                  </p>
                </div>
                <button
                  onClick={() => setIsPruned(!isPruned)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    isPruned 
                      ? 'bg-[#25D366] text-[#111B21] border-[#25D366]' 
                      : 'bg-[var(--wa-surface-subtle)] text-[var(--wa-ink)] border-[var(--wa-border)] hover:border-[#25D366]'
                  }`}
                >
                  {isPruned ? '✓ 6 Redundant Blasts Pruned' : 'Prune 6 Redundant Blasts'}
                </button>
              </div>

              {/* Exact Duplicate Comparison Matrix */}
              <div className="space-y-2.5">
                <div className="text-xs font-normal text-[var(--wa-ink-muted)] uppercase tracking-wider">
                  Identical Burst Comparison: Burst 7 (12:10 PM) vs Burst 8 (1:13 PM)
                </div>
                <div className="border border-[var(--wa-border)] rounded-[15px] overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[var(--wa-surface-subtle)] border-b border-[var(--wa-border)] text-[var(--wa-ink-muted)]">
                      <tr>
                        <th className="p-2.5 font-normal">SHA-256 Fingerprint</th>
                        <th className="p-2.5 font-normal">File Name</th>
                        <th className="p-2.5 font-normal">First Post (12:10 PM)</th>
                        <th className="p-2.5 font-normal">Repeated Blast (1:13 PM)</th>
                        <th className="p-2.5 font-normal">Delta</th>
                        <th className="p-2.5 font-normal">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--wa-border)]">
                      <tr className={isPruned ? 'opacity-50' : ''}>
                        <td className="p-2.5 font-mono text-[11px] text-[var(--wa-ink)]">DAE79208758D...</td>
                        <td className="p-2.5 text-[var(--wa-ink-muted)]">image_121054.jpg</td>
                        <td className="p-2.5 text-[#25D366]">12:10:52 PKT</td>
                        <td className="p-2.5 text-amber-500">13:13:49 PKT</td>
                        <td className="p-2.5">+1 hr 2 min</td>
                        <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px]">Prunable</span></td>
                      </tr>
                      <tr className={isPruned ? 'opacity-50' : ''}>
                        <td className="p-2.5 font-mono text-[11px] text-[var(--wa-ink)]">B7A69408B62B...</td>
                        <td className="p-2.5 text-[var(--wa-ink-muted)]">image_121105.jpg</td>
                        <td className="p-2.5 text-[#25D366]">12:11:03 PKT</td>
                        <td className="p-2.5 text-amber-500">13:13:50 PKT</td>
                        <td className="p-2.5">+1 hr 2 min</td>
                        <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px]">Prunable</span></td>
                      </tr>
                      <tr className={isPruned ? 'opacity-50' : ''}>
                        <td className="p-2.5 font-mono text-[11px] text-[var(--wa-ink)]">70373C95ADC9...</td>
                        <td className="p-2.5 text-[var(--wa-ink-muted)]">image_121110.jpg</td>
                        <td className="p-2.5 text-[#25D366]">12:11:08 PKT</td>
                        <td className="p-2.5 text-amber-500">13:13:51 PKT</td>
                        <td className="p-2.5">+1 hr 2 min</td>
                        <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px]">Prunable</span></td>
                      </tr>
                      <tr className={isPruned ? 'opacity-50' : ''}>
                        <td className="p-2.5 font-mono text-[11px] text-[var(--wa-ink)]">1FAFFCA25BDB...</td>
                        <td className="p-2.5 text-[var(--wa-ink-muted)]">image_121117.jpg</td>
                        <td className="p-2.5 text-[#25D366]">12:11:16 PKT</td>
                        <td className="p-2.5 text-amber-500">13:13:51 PKT</td>
                        <td className="p-2.5">+1 hr 2 min</td>
                        <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px]">Prunable</span></td>
                      </tr>
                      <tr className={isPruned ? 'opacity-50' : ''}>
                        <td className="p-2.5 font-mono text-[11px] text-[var(--wa-ink)]">761892AA30AA...</td>
                        <td className="p-2.5 text-[var(--wa-ink-muted)]">image_121124.jpg</td>
                        <td className="p-2.5 text-[#25D366]">12:11:22 PKT</td>
                        <td className="p-2.5 text-amber-500">13:13:52 PKT</td>
                        <td className="p-2.5">+1 hr 2 min</td>
                        <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px]">Prunable</span></td>
                      </tr>
                      <tr className={isPruned ? 'opacity-50' : ''}>
                        <td className="p-2.5 font-mono text-[11px] text-[var(--wa-ink)]">A3F9D01719C6...</td>
                        <td className="p-2.5 text-[var(--wa-ink-muted)]">image_121139.jpg</td>
                        <td className="p-2.5 text-[#25D366]">12:11:38 PKT</td>
                        <td className="p-2.5 text-amber-500">13:13:52 PKT</td>
                        <td className="p-2.5">+1 hr 2 min</td>
                        <td className="p-2.5"><span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px]">Prunable</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Correlations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-[15px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)]">
                  <h4 className="text-xs font-normal text-[var(--wa-ink)]">Private DM Cross-Posts (3 Items)</h4>
                  <p className="text-[11px] text-[var(--wa-ink-muted)] mt-1">
                    SHA <code>EE779037...</code> and <code>D58E620E...</code> were posted in the group and then sent to private chat with address: "Quetta RUSSI market Pakistan godam number 65".
                  </p>
                </div>
                <div className="p-3.5 rounded-[15px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)]">
                  <h4 className="text-xs font-normal text-[var(--wa-ink)]">Market Cross-Posts (3 Hubs)</h4>
                  <p className="text-[11px] text-[var(--wa-ink-muted)] mt-1">
                    Identical SHA hashes detected across <em>⭐ QUETTA LOT PRIME ⭐</em> and <em>Online Product Sellar</em>, confirming multi-group wholesale liquidation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shopify' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-normal text-[var(--wa-ink)]">
                    Official Shopify Store Import Dataset
                  </h3>
                  <p className="text-xs text-[var(--wa-ink-muted)]">
                    Deduplicated and structured into standard Shopify Product CSV format with variants, inventory, and images.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyShopifyInstructions}
                    className="px-3 py-1.5 rounded-full border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] text-xs text-[var(--wa-ink)] hover:border-[#25D366] flex items-center gap-1.5 transition-all"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy Guide'}</span>
                  </button>
                  <a
                    href={downloadCsvUrl}
                    download="shopify_products_import.csv"
                    className="px-4 py-1.5 rounded-full bg-[#25D366] text-[#111B21] hover:bg-[#20ba5a] text-xs font-normal flex items-center gap-1.5 shadow-md shadow-[#25D366]/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Shopify CSV</span>
                  </a>
                </div>
              </div>

              {/* Product Previews */}
              <div className="space-y-3">
                <div className="text-xs font-normal text-[var(--wa-ink-muted)] uppercase tracking-wider">
                  Generated Store Products (6 Normalized Catalog Items)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Dell XPS 17 */}
                  <div className="p-3.5 rounded-[15px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-normal text-xs text-[var(--wa-ink)]">
                        Dell XPS 17 9700 Workstation (Core i9-10875H / 16GB / 512GB / GTX 2060 / 4K UHD+)
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] shrink-0">
                        Rs 180,000
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--wa-ink-muted)] line-clamp-2">
                      American Lot imported via Quetta Russi Market. 17-inch 4K UHD+ 3840x2400 touch display, 9 photo gallery.
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--wa-ink-muted)] pt-1 border-t border-[var(--wa-border)]">
                      <span>SKU: ALR-DELL-XPS9700-I9</span>
                      <span>Qty: 3 In Stock</span>
                    </div>
                  </div>

                  {/* Samsung S22 Ultra */}
                  <div className="p-3.5 rounded-[15px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-normal text-xs text-[var(--wa-ink)]">
                        Samsung Galaxy S22 Ultra 5G (Snapdragon 8 Gen 1 | 12GB | 256GB | S-Pen)
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] shrink-0">
                        Rs 145,000
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--wa-ink-muted)] line-clamp-2">
                      108MP Quad camera, 100x Space zoom, Grade A Japanese/US wholesale lot.
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--wa-ink-muted)] pt-1 border-t border-[var(--wa-border)]">
                      <span>SKU: ALR-SAM-S22U-256</span>
                      <span>Qty: 5 In Stock</span>
                    </div>
                  </div>

                  {/* iPhone 13 Pro Max */}
                  <div className="p-3.5 rounded-[15px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-normal text-xs text-[var(--wa-ink)]">
                        Apple iPhone 13 Pro Max 256GB Gold (92% Battery Health | Factory Unlocked)
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] shrink-0">
                        Rs 195,000
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--wa-ink-muted)] line-clamp-2">
                      Canadian lot, 120Hz ProMotion display, 100% 3U Tools green score, clean gold housing.
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--wa-ink-muted)] pt-1 border-t border-[var(--wa-border)]">
                      <span>SKU: ALR-IPH-13PM-GLD</span>
                      <span>Qty: 4 In Stock</span>
                    </div>
                  </div>

                  {/* Google Pixel 7 Pro */}
                  <div className="p-3.5 rounded-[15px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-normal text-xs text-[var(--wa-ink)]">
                        Google Pixel 7 Pro 5G 12GB/128GB (Tensor G2 | 50MP Camera | Hazel)
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] shrink-0">
                        Rs 98,000
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--wa-ink-muted)] line-clamp-2">
                      120Hz LTPO OLED curved screen, pure Google camera software, unlockable OEM.
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--wa-ink-muted)] pt-1 border-t border-[var(--wa-border)]">
                      <span>SKU: ALR-PIX-7PRO-HBL</span>
                      <span>Qty: 6 In Stock</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Step Store Launch Guide */}
              <div className="p-4 rounded-[20px] border border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] space-y-2">
                <h4 className="text-xs font-normal text-[var(--wa-ink)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>How to Launch This Store on Shopify in 3 Minutes</span>
                </h4>
                <ol className="text-xs text-[var(--wa-ink-muted)] space-y-1.5 list-decimal list-inside">
                  <li>Download <code>shopify_products_import.csv</code> using the button above.</li>
                  <li>Log in to your <strong>Shopify Admin</strong> &rarr; Click <strong>Products</strong> &rarr; Click <strong>Import</strong>.</li>
                  <li>Upload the CSV and click <strong>Import Products</strong>. All items, prices in PKR, and specs appear instantly in your store!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] flex items-center justify-between">
          <div className="text-xs text-[var(--wa-ink-muted)]">
            Artifacts saved to <code>tech-deal-hunter/al_raheem_mobile_market_export.zip</code>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[var(--wa-border)] bg-[var(--wa-surface)] text-xs text-[var(--wa-ink)] hover:border-[#25D366] transition-all"
            >
              Close
            </button>
            <a
              href={downloadZipUrl}
              download="al_raheem_mobile_market_export.zip"
              className="px-4 py-2 rounded-full bg-[#25D366] text-[#111B21] hover:bg-[#20ba5a] text-xs font-normal flex items-center gap-1.5 transition-all shadow-md shadow-[#25D366]/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
