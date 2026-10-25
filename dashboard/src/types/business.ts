export interface BusinessProfile {
  id: string;
  name: string;
  tagline: string;
  niche: string;
  currency: string;
  currencySymbol: string;
  targetMarginPercent: number;
  categories: string[];
  sampleKeywords: string[];
  description: string;
}

export const PRESET_BUSINESS_PROFILES: BusinessProfile[] = [
  {
    id: 'tech-electronics',
    name: 'Tech & Laptop Wholesale Importer',
    tagline: 'Laptops, MacBooks, Flagship Phones & Components',
    niche: 'Electronics & Computing',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    targetMarginPercent: 18,
    categories: ['MacBook Series', 'HP Spectre & Elite', 'Dell XPS & Precision', 'iPhones & Apple', 'Other Mobile Phones'],
    sampleKeywords: ['RAM', 'SSD', 'NVMe', 'Retina', 'OLED', 'Battery Health', 'Core i7', 'Core i9', 'M1', 'M2', 'M3'],
    description: 'Specialized for tech lot buyers scouring wholesale markets (Karachi Saddar, Hafeez Center Lahore, Quetta Russi Market).'
  },
  {
    id: 'smartphones-gadgets',
    name: 'Smartphone & Gadgets Trader',
    tagline: 'Used Flagships, PTA Approved, Box-Packed & Kits',
    niche: 'Mobile & Accessories',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    targetMarginPercent: 12,
    categories: ['Apple iPhone Kits', 'Samsung Galaxy S/Z Series', 'Google Pixel Non-PTA', 'OnePlus & Xiaomi', 'Tablets & iPads'],
    sampleKeywords: ['PTA Approved', 'Non-PTA', 'eSIM', 'Battery 85%+', 'JV', 'Waterpack', 'Factory Unlock'],
    description: 'Designed for smartphone retailers comparing container lot prices and VIP dealer broadcasts.'
  },
  {
    id: 'solar-energy',
    name: 'Solar & Power Solutions Distributor',
    tagline: 'Hybrid Inverters, Tier-1 Panels & Lithium Batteries',
    niche: 'Renewable Energy',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    targetMarginPercent: 15,
    categories: ['Hybrid Inverters (6kW-12kW)', 'Tier-1 Bifacial Solar Panels', 'LiFePO4 Lithium Batteries', 'Tubular Batteries', 'DC Breakers & Accessories'],
    sampleKeywords: ['Inverex', 'Growatt', 'Nitrox', 'Longi 585W', 'Jinko N-Type', 'Pylontech 48V', 'Dyness', 'Voltronic'],
    description: 'Built for solar dealers and installation engineers buying container-load equipment on WhatsApp trade groups.'
  },
  {
    id: 'auto-parts',
    name: 'Automobile & Japanese Spares Importer',
    tagline: 'Kabli Engines, Gearboxes, Body Parts & Half-Cuts',
    niche: 'Automotive Spares',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    targetMarginPercent: 25,
    categories: ['Engines & Assemblies', 'Automatic & CVT Gearboxes', 'Suspension & Shocks', 'Body Kits & Headlights', 'Imported Alloy Rims'],
    sampleKeywords: ['Kabli', 'Japanese Half-cut', 'Genuine', 'Toyota 1NZ', 'Honda R18', 'Pristine Condition', 'Direct From Port'],
    description: 'Ideal for auto parts scrap & kabli merchants purchasing directly from Shershah Karachi or Chaman borders.'
  },
  {
    id: 'universal-arbitrage',
    name: 'Custom Multi-Niche Arbitrage Hunter',
    tagline: 'Custom Categories, Dynamic Currencies & Multi-Group Hunter',
    niche: 'General Merchandise',
    currency: 'USD',
    currencySymbol: '$',
    targetMarginPercent: 20,
    categories: ['High Margin Lots', 'Clearance Stock', 'VIP Liquidations', 'Bulk Containers'],
    sampleKeywords: ['Wholesale', 'Lot Available', 'Full Lot Price', 'Immediate Payment', 'Container Arrival'],
    description: 'General arbitrage configuration allowing any business owner to build custom categories and monitor any WhatsApp group.'
  }
];
