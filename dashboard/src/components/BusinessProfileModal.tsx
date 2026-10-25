import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Check, 
  Plus, 
  Trash2, 
  Percent, 
  Sparkles, 
  Coins
} from 'lucide-react';
import { PRESET_BUSINESS_PROFILES, type BusinessProfile } from '../types/business';

interface BusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: BusinessProfile;
  onUpdateProfile: (profile: BusinessProfile) => void;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onUpdateProfile,
}) => {
  const [profile, setProfile] = useState<BusinessProfile>({ ...currentProfile });
  const [newCatInput, setNewCatInput] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: BusinessProfile) => {
    setProfile({ ...preset });
  };

  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    if (!profile.categories.includes(newCatInput.trim())) {
      setProfile({
        ...profile,
        categories: [...profile.categories, newCatInput.trim()]
      });
    }
    setNewCatInput('');
  };

  const handleRemoveCategory = (cat: string) => {
    setProfile({
      ...profile,
      categories: profile.categories.filter((c) => c !== cat)
    });
  };

  const handleSave = () => {
    onUpdateProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[var(--wa-surface)] text-[var(--wa-ink)] border border-[var(--wa-border)] wa-tile shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--wa-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-normal text-[var(--wa-ink)]">
                Business Profile & Niche Architecture
              </h2>
              <p className="text-xs text-[var(--wa-ink-muted)]">
                Configure WhatsApp deal hunting for your specific trade, shop, or inventory
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Preset Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--wa-ink-muted)] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#25D366]" />
              Select Industry Niche Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_BUSINESS_PROFILES.map((preset) => {
                const isSelected = profile.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 text-left wa-tile border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#25D366] bg-[#25D366]/10 text-[var(--wa-ink)] shadow-sm'
                        : 'border-[var(--wa-border)] bg-[var(--wa-surface-subtle)] text-[var(--wa-ink-muted)] hover:border-[var(--wa-ink-muted)]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-normal text-sm text-[var(--wa-ink)]">{preset.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#25D366]" />}
                    </div>
                    <p className="text-[11px] mt-1 line-clamp-2">{preset.description}</p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--wa-surface)] border border-[var(--wa-border)]">
                        {preset.categories.length} Categories
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366]">
                        {preset.currency} ({preset.currencySymbol})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Details Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--wa-ink-muted)] mb-1">
                Your Business / Shop Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] rounded-full text-[var(--wa-ink)] focus:outline-none focus:border-[#25D366]"
                placeholder="e.g. Al-Madina Tech Wholesale"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[var(--wa-ink-muted)] mb-1 flex items-center gap-1">
                <Coins className="w-3 h-3 text-[#25D366]" />
                Primary Trade Currency
              </label>
              <select
                value={profile.currency}
                onChange={(e) => {
                  const curr = e.target.value;
                  const symMap: { [k: string]: string } = {
                    PKR: 'Rs.',
                    USD: '$',
                    AED: 'AED',
                    SAR: 'SAR',
                    EUR: '€',
                    GBP: '£',
                    INR: '₹'
                  };
                  setProfile({
                    ...profile,
                    currency: curr,
                    currencySymbol: symMap[curr] || curr
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] rounded-full text-[var(--wa-ink)] focus:outline-none focus:border-[#25D366]"
              >
                <option value="PKR">PKR (Pakistani Rupee - Rs.)</option>
                <option value="USD">USD (US Dollar - $)</option>
                <option value="AED">AED (UAE Dirham)</option>
                <option value="SAR">SAR (Saudi Riyal)</option>
                <option value="EUR">EUR (Euro - €)</option>
                <option value="GBP">GBP (British Pound - £)</option>
                <option value="INR">INR (Indian Rupee - ₹)</option>
              </select>
            </div>
          </div>

          {/* Target Margin Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] uppercase tracking-wider text-[var(--wa-ink-muted)] flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-[#25D366]" />
                Target Arbitrage / Resell Margin
              </label>
              <span className="text-sm font-normal text-[#25D366]">
                {profile.targetMarginPercent}% Margin
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={profile.targetMarginPercent}
              onChange={(e) => setProfile({ ...profile, targetMarginPercent: parseInt(e.target.value, 10) })}
              className="w-full accent-[#25D366] cursor-pointer"
            />
            <p className="text-[11px] text-[var(--wa-ink-muted)] mt-1">
              Used to calculate arbitrage discount ratings and alert badges on wholesale lots.
            </p>
          </div>

          {/* Active Categories Editor */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--wa-ink-muted)] mb-2">
              Active Trade Categories & WhatsApp Match Rules
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-full bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] text-[var(--wa-ink)] flex items-center gap-2"
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => handleRemoveCategory(cat)}
                    className="text-[var(--wa-ink-muted)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add new category inline */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                placeholder="Add custom category (e.g. Solar Inverters, Mechanical Parts)..."
                className="flex-1 px-3.5 py-2 bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] rounded-full text-[var(--wa-ink)] placeholder-[var(--wa-ink-muted)] focus:outline-none focus:border-[#25D366]"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 rounded-full bg-[#25D366] text-[#111B21] flex items-center gap-1.5 hover:bg-[#20ba5a] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>
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
            onClick={handleSave}
            className="px-6 py-2 rounded-full bg-[#25D366] text-[#111B21] hover:bg-[#20ba5a] shadow-lg shadow-[#25D366]/20 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Business Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
