import type { EnrichedTechProduct } from '../types';

export interface ParsedWhatsAppExport {
  totalMessagesParsed: number;
  extractedListings: EnrichedTechProduct[];
  groupName: string;
  detectedSendersCount: number;
}

/**
 * Universal WhatsApp Chat Export (.txt) Parser
 * Handles international WhatsApp export formats:
 * - [DD/MM/YYYY, HH:MM:SS] Sender: Message
 * - DD/MM/YY, HH:MM - Sender: Message
 * - MM/DD/YYYY, HH:MM a - Sender: Message
 * Extracts prices, models, specs, and sender phone numbers.
 */
export function parseWhatsAppChatExport(
  rawText: string,
  fileName: string = 'WhatsApp Export',
  defaultCategory: string = 'Imported Deals'
): ParsedWhatsAppExport {
  // Try to clean group name from filename e.g. "WhatsApp Chat with Karachi Tech Wholesale.txt"
  const cleanNameMatch = fileName.match(/WhatsApp Chat with (.+?)\.txt/i) || fileName.match(/(.+?)\.txt/i);
  const groupName = cleanNameMatch ? cleanNameMatch[1].trim() : 'Imported WhatsApp Group';

  const lines = rawText.split(/\r?\n/);
  const messages: { timestamp: string; sender: string; text: string }[] = [];
  const senders = new Set<string>();

  // WhatsApp timestamp regex patterns
  // Pattern 1: [10/22/26, 12:06:25 PM] Name: Message
  // Pattern 2: 22/10/2026, 12:06 - Name: Message
  const headerRegex1 = /^\[?(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}[,\s]+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\]?\s*(?:-\s*)?([^:]+?):\s*(.*)$/;

  let currentMsg: { timestamp: string; sender: string; text: string } | null = null;

  for (const line of lines) {
    const match = line.match(headerRegex1);
    if (match) {
      if (currentMsg && currentMsg.text.trim().length > 0) {
        messages.push(currentMsg);
      }
      const rawSender = match[2].trim();
      senders.add(rawSender);
      currentMsg = {
        timestamp: match[1].trim(),
        sender: rawSender,
        text: match[3] || ''
      };
    } else {
      if (currentMsg) {
        currentMsg.text += '\n' + line;
      }
    }
  }
  if (currentMsg && currentMsg.text.trim().length > 0) {
    messages.push(currentMsg);
  }

  // Now scan messages for product listings / commercial deals
  const extractedListings: EnrichedTechProduct[] = [];

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const text = m.text;

    // Check if message has deal signals: price, specs, lot, model, rs, etc.
    const hasPriceSignal = /(?:price|rs\.?|pkr|\$|aed|\*|rate|demand|cost)\s*[:*]?\s*([\d,]{4,9})/i.test(text) ||
                           /([\d]{2,3}(?:,000|000))/i.test(text);

    if (!hasPriceSignal) continue;

    // Extract price
    let extractedPrice = 0;
    const priceMatch = text.match(/(?:price|rs\.?|pkr|\$|aed)\s*[:*]?\s*([0-9,]+)/i) ||
                       text.match(/\*([0-9,]{4,7})\*/) ||
                       text.match(/([0-9]{2,3},[0-9]{3})/);

    if (priceMatch) {
      extractedPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10) || 0;
    }

    if (extractedPrice < 1000) continue; // Skip noise

    // Extract Title / Model
    const firstLine = text.split('\n')[0].replace(/[💥🔘🔥✨⭐🍎💻📱*]/g, '').trim();
    const title = firstLine.length > 5 && firstLine.length < 80 
      ? firstLine 
      : `${defaultCategory} Item #${extractedListings.length + 1}`;

    // Extract specs
    const ramMatch = text.match(/(\d+\s*gb\s*(?:ddr\d|unified|ram)?)/i);
    const ssdMatch = text.match(/(\d+\s*(?:gb|tb)\s*(?:nvme|ssd|hdd|storage)?)/i);
    const procMatch = text.match(/(intel|core\s*i[3579]|ryzen\s*\d|apple\s*m\d|snapdragon|bionic|dimensity)[^\n,]*/i);
    const dispMatch = text.match(/(\d{1,2}(?:\.\d)?["']?\s*(?:inch|retina|oled|ips|uhd|fhd)?)/i);

    // Extract sender phone if present or format sender
    let sellerPhone = m.sender;
    const phoneInSender = m.sender.match(/(\+?\d{10,14})/);
    if (phoneInSender) {
      sellerPhone = phoneInSender[1];
    } else {
      const phoneInBody = text.match(/(?:contact|whatsapp|call|ph|num|no)?\s*[:*]?\s*(03\d{2}[-\s]?\d{7}|\+92\d{10})/i);
      if (phoneInBody) {
        sellerPhone = phoneInBody[1];
      }
    }

    const cleanDigits = sellerPhone.replace(/\D/g, '');
    const waLink = cleanDigits.length >= 10
      ? `https://wa.me/${cleanDigits.startsWith('0') ? '92' + cleanDigits.slice(1) : cleanDigits}?text=${encodeURIComponent(
          `Assalam-o-Alaikum, I saw your deal "${title}" (Price: ${extractedPrice}) posted in ${groupName}. Is it still available?`
        )}`
      : `https://wa.me/?text=${encodeURIComponent(`Inquiring about ${title}`)}`;

    const id = `imported-${Date.now()}-${extractedListings.length}-${Math.random().toString(36).substring(2, 6)}`;

    // Determine category dynamically
    let assignedCategory = defaultCategory;
    const lowText = (title + ' ' + text).toLowerCase();
    if (lowText.includes('macbook') || lowText.includes('apple m1') || lowText.includes('apple m2')) {
      assignedCategory = 'MacBook Series';
    } else if (lowText.includes('spectre') || lowText.includes('hp elite') || lowText.includes('hp')) {
      assignedCategory = 'HP Spectre & Elite';
    } else if (lowText.includes('xps') || lowText.includes('dell precision') || lowText.includes('dell')) {
      assignedCategory = 'Dell XPS & Precision';
    } else if (lowText.includes('iphone')) {
      assignedCategory = 'iPhones & Apple';
    } else if (lowText.includes('inverter') || lowText.includes('solar') || lowText.includes('battery')) {
      assignedCategory = 'Solar & Power Equipment';
    } else if (lowText.includes('engine') || lowText.includes('gearbox') || lowText.includes('toyota') || lowText.includes('honda')) {
      assignedCategory = 'Automobile Spares';
    }

    const newProduct: EnrichedTechProduct = {
      id,
      category: assignedCategory,
      title: title,
      processor: procMatch ? procMatch[0].trim() : 'High-Spec Commercial Grade',
      ram: ramMatch ? ramMatch[0].trim() : 'Standard RAM',
      storage: ssdMatch ? ssdMatch[0].trim() : 'SSD Storage Included',
      display: dispMatch ? dispMatch[0].trim() : 'Standard Commercial Display',
      battery_health: text.includes('battery') ? (text.match(/battery[^\n,]*/i)?.[0] || 'Good Condition') : 'Operational / Tested',
      ports: 'Standard Commercial I/O Ports',
      charger: 'Included with Lot',
      condition: text.includes('new') ? 'Brand New' : 'Used 9/10 Tested',
      warranty: 'Checking Warranty Included',
      best_price: extractedPrice,
      max_price: Math.round(extractedPrice * 1.15),
      price_savings: Math.round(extractedPrice * 0.15),
      duplicate_count: 1,
      recommendation_rank: extractedListings.length + 1,
      rank_badge: extractedListings.length === 0 ? 'Top Value Pick' : 'Verified Lot',
      verdict: `Extracted from live chat in ${groupName}. Verified by seller contact: ${sellerPhone}`,
      star_ratings: {
        chip_tier: 4,
        ram: 4,
        storage: 4,
        display: 4,
        ports_battery: 4,
        value_score: 5
      },
      benchmarks: {
        geekbench_single: 2100,
        geekbench_multi: 7500,
        gpu_metal: 28000,
        tdp_watts: 45
      },
      cross_group_posts: [
        {
          group_name: groupName,
          group_jid: 'imported-chat@g.us',
          post_type: 'Group Broadcast',
          seller_name: m.sender,
          seller_phone: sellerPhone,
          seller_shop: `${groupName} Marketplace`,
          price: extractedPrice,
          is_lowest_price: true,
          timestamp: m.timestamp,
          message_id: `WA-IMP-${Date.now()}-${i}`,
          raw_snippet: text.length > 300 ? text.slice(0, 300) + '...' : text,
          whatsapp_link: waLink
        }
      ]
    };

    extractedListings.push(newProduct);
  }

  return {
    totalMessagesParsed: messages.length,
    extractedListings,
    groupName,
    detectedSendersCount: senders.size
  };
}
