import React, { useState } from 'react';
import { 
  UploadCloud, 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Sparkles 
} from 'lucide-react';
import { parseWhatsAppChatExport, type ParsedWhatsAppExport } from '../utils/whatsappChatParser';
import type { EnrichedTechProduct } from '../types';

interface ChatImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCategories: string[];
  onImportDeals: (newDeals: EnrichedTechProduct[], groupName: string) => void;
}

export const ChatImportModal: React.FC<ChatImportModalProps> = ({
  isOpen,
  onClose,
  availableCategories,
  onImportDeals,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedWhatsAppExport | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(availableCategories[0] || 'Imported Deals');
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleProcessText = (content: string, name: string) => {
    setFileName(name);
    const result = parseWhatsAppChatExport(content, name, selectedCategory);
    setParsedResult(result);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleProcessText(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleProcessText(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSampleChat = () => {
    const sample = `[24/10/2026, 11:15:30] +92 300 4581290: 🍎 Hafeez Center Fresh Lot Arrived!
MacBook Pro 14 M2 Pro Space Gray
Processor: Apple M2 Pro (10-core CPU, 16-core GPU)
RAM: 16GB Unified Memory
Storage: 512GB Apple High-Speed SSD
Condition: 9.8/10 Scratchless with Original 67W Charger
Price: *285,000*
Contact: 0300-4581290

[24/10/2026, 11:30:12] +92 315 0477792: 💥 DELL XPS 15 9520 4K OLED LOT
Processor: Intel Core i7-12700H 14 Cores
RAM: 32GB DDR5 4800MHz
SSD: 1TB NVMe Gen4
Graphics: NVIDIA RTX 3050 Ti 4GB GDDR6
Display: 15.6" 3.5K OLED Touchscreen (3456x2160)
Condition: 9.5/10 Like New
Price: *230,000* FNF
Quetta RUSSI Market Al-Raheem Electronics Mobile

[24/10/2026, 12:05:44] +92 321 8294710: 📱 iPhone 14 Pro Max 256GB Deep Purple
Physical Dual SIM, PTA Approved Official
Battery Health: 94% Genuine
Box and Original Cable Available
Demand: *345,000*
Karachi Saddar Star City Mall Shop 14`;

    setRawText(sample);
    handleProcessText(sample, 'WhatsApp Chat with Hafeez Center Wholesale.txt');
  };

  const handleConfirmImport = () => {
    if (parsedResult && parsedResult.extractedListings.length > 0) {
      onImportDeals(parsedResult.extractedListings, parsedResult.groupName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[var(--wa-surface)] text-[var(--wa-ink)] border border-[var(--wa-border)] wa-tile shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--wa-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-normal text-[var(--wa-ink)]">
                Universal WhatsApp Chat Export Importer
              </h2>
              <p className="text-xs text-[var(--wa-ink-muted)]">
                Import exported chats (.txt) from any WhatsApp group or vendor in the world
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--wa-ink-muted)] hover:text-[var(--wa-ink)] hover:bg-[var(--wa-surface-subtle)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Target Category Selector */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--wa-ink-muted)] mb-1">
              Assign Imported Deals to Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (rawText) handleProcessText(rawText, fileName || 'WhatsApp Chat Export.txt');
              }}
              className="w-full px-3.5 py-2.5 bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] rounded-full text-[var(--wa-ink)] focus:outline-none focus:border-[#25D366]"
            >
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Custom Wholesale Deals">Custom Wholesale Deals (Create New)</option>
            </select>
          </div>

          {/* Drag & Drop File Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed wa-tile p-8 text-center transition-all flex flex-col items-center justify-center ${
              dragActive
                ? 'border-[#25D366] bg-[#25D366]/10'
                : 'border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] hover:border-[var(--wa-ink-muted)]'
            }`}
          >
            <FileText className="w-10 h-10 text-[var(--wa-ink-muted)] mb-3" />
            <p className="text-sm font-normal text-[var(--wa-ink)] mb-1">
              Drag & Drop your WhatsApp Chat Export (<span className="text-[#25D366]">.txt</span> file) here
            </p>
            <p className="text-[11px] text-[var(--wa-ink-muted)] mb-4">
              Exported from WhatsApp: Group Chat → More → Export Chat without media
            </p>
            
            <div className="flex items-center gap-3">
              <label className="px-5 py-2 rounded-full bg-[#25D366] text-[#111B21] cursor-pointer hover:bg-[#20ba5a] transition-all">
                Browse .txt File
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleLoadSampleChat}
                className="px-4 py-2 rounded-full border border-[var(--wa-border)] text-[var(--wa-ink)] hover:bg-[var(--wa-surface)] flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Load Sample Wholesale Chat</span>
              </button>
            </div>
          </div>

          {/* Or Paste Text Option */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--wa-ink-muted)] mb-1">
              Or Paste Raw Chat Text Directly
            </label>
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                handleProcessText(e.target.value, 'Pasted WhatsApp Chat.txt');
              }}
              placeholder="Paste chat snippet containing product descriptions, prices, and seller numbers..."
              className="w-full p-3.5 bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] wa-tile text-[var(--wa-ink)] placeholder-[var(--wa-ink-muted)] focus:outline-none focus:border-[#25D366] font-mono text-[11px]"
            />
          </div>

          {/* Parsing Results Preview */}
          {parsedResult && (
            <div className="p-4 wa-tile bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[var(--wa-border)] pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                  <span className="text-sm font-normal text-[var(--wa-ink)]">
                    Parsing Complete: {parsedResult.groupName}
                  </span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] font-mono">
                  {parsedResult.extractedListings.length} Deals Extracted
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-[var(--wa-surface)] border border-[var(--wa-border)]">
                  <div className="text-sm font-normal text-[var(--wa-ink)]">{parsedResult.totalMessagesParsed}</div>
                  <div className="text-[10px] text-[var(--wa-ink-muted)]">Messages Read</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--wa-surface)] border border-[var(--wa-border)]">
                  <div className="text-sm font-normal text-[#25D366]">{parsedResult.extractedListings.length}</div>
                  <div className="text-[10px] text-[var(--wa-ink-muted)]">Commercial Deals</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--wa-surface)] border border-[var(--wa-border)]">
                  <div className="text-sm font-normal text-[var(--wa-ink)]">{parsedResult.detectedSendersCount}</div>
                  <div className="text-[10px] text-[var(--wa-ink-muted)]">Active Senders</div>
                </div>
              </div>

              {/* Sample extracted item preview */}
              {parsedResult.extractedListings.length > 0 ? (
                <div className="space-y-2 mt-2">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--wa-ink-muted)]">
                    Extracted Deals Preview:
                  </div>
                  {parsedResult.extractedListings.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[var(--wa-surface)] border border-[var(--wa-border)] flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-normal text-[var(--wa-ink)]">{item.title}</div>
                        <div className="text-[10px] text-[var(--wa-ink-muted)] flex items-center gap-2 mt-0.5">
                          <span>{item.processor}</span>
                          <span>•</span>
                          <span>{item.ram}</span>
                          <span>•</span>
                          <span>{item.cross_group_posts[0]?.seller_phone}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-normal text-[#25D366]">
                          Rs. {item.best_price.toLocaleString()}
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#005C4B]/20 text-[#25D366]">
                          wa.me ready
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-500 py-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-[11px]">
                    No commercial price signals detected in this sample. Ensure messages include price (e.g. Price: 18,000 or Rs. 145,000).
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--wa-border)] flex items-center justify-between bg-[var(--wa-surface-subtle)]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-[var(--wa-border)] text-[var(--wa-ink)] hover:bg-[var(--wa-surface)] transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!parsedResult || parsedResult.extractedListings.length === 0}
            onClick={handleConfirmImport}
            className="px-6 py-2 rounded-full bg-[#25D366] text-[#111B21] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#20ba5a] shadow-lg shadow-[#25D366]/20 transition-all flex items-center gap-2 font-normal"
          >
            <Download className="w-4 h-4" />
            <span>Import {parsedResult?.extractedListings.length || 0} Deals to Radar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
