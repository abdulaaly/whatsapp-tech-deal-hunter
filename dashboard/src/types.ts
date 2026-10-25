export interface CrossGroupPost {
  group_name: string;
  group_jid: string;
  post_type: string;
  seller_name: string;
  seller_phone: string;
  seller_shop: string;
  price: number;
  is_lowest_price: boolean;
  timestamp: string;
  message_id: string;
  raw_snippet: string;
  whatsapp_link: string;
}

export interface StarRatings {
  chip_tier: number;
  ram: number;
  storage: number;
  display: number;
  ports_battery: number;
  value_score: number;
}

export interface Benchmarks {
  geekbench_single?: number;
  geekbench_multi?: number;
  gpu_metal?: number;
  gpu_vulkan?: number;
  passmark_cpu?: number;
  tdp_watts?: number;
}

export interface EnrichedTechProduct {
  id: string;
  category: string;
  title: string;
  processor: string;
  ram: string;
  storage: string;
  display: string;
  battery_health: string;
  ports: string;
  charger: string;
  condition: string;
  warranty: string;
  best_price: number;
  max_price: number;
  price_savings: number;
  duplicate_count: number;
  recommendation_rank: number;
  rank_badge: string;
  verdict: string;
  star_ratings: StarRatings;
  benchmarks: Benchmarks;
  cross_group_posts: CrossGroupPost[];
}

export interface CandidateMatch {
  phone: string;
  name: string;
  match_reason: string;
  confidence_pct: number;
}

export interface VerificationReceipt {
  id: string;
  seller_name: string;
  seller_phone: string;
  group_name: string;
  receipt_image_ref: string;
  wallet_type: string;
  trx_id: string;
  amount_pkr: number;
  item_purchased: string;
  transaction_timestamp: string;
  extracted_partial_digits: string;
  candidate_matches: CandidateMatch[];
  top_candidate_phone: string;
  top_candidate_name: string;
  confidence_score: number;
  verification_message_text: string;
  verification_wa_link: string;
  seller_wa_link: string;
}

export interface BuyerVerificationData {
  audit_title: string;
  total_receipts_audited: number;
  high_confidence_matches: number;
  moderate_confidence_matches: number;
  low_confidence_or_unmatched: number;
  verification_receipts: VerificationReceipt[];
}

export interface VoiceAIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionExecuted?: string;
}
