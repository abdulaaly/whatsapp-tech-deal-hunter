import React from 'react';
import type { BuyerVerificationData, VerificationReceipt } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  MessageCircle, 
  ExternalLink, 
  FileText, 
  Smartphone, 
  Store 
} from 'lucide-react';

interface BuyerVerificationTabProps {
  data: BuyerVerificationData;
  currencySymbol?: string;
}

export const BuyerVerificationTab: React.FC<BuyerVerificationTabProps> = ({ 
  data, 
  currencySymbol = 'Rs.' 
}) => {
  return (
    <div className="space-y-6">
      {/* Verification Header Banner */}
      <div className="bg-[var(--wa-surface)] rounded-[25px] p-6 relative overflow-hidden border border-[var(--wa-border)] shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-normal tracking-wider px-3 py-1 rounded-full bg-[#005C4B]/20 text-[#25D366] border border-[#25D366]/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Seller Legitimacy Audit
              </span>
              <span className="text-xs text-[var(--wa-ink-muted)]">
                Native OCR & Group Participant Cross-Match
              </span>
            </div>
            <h2 className="text-2xl font-normal text-[var(--wa-ink)] tracking-tight">
              Payment Screenshot Buyer Verification Queue
            </h2>
            <p className="text-sm text-[var(--wa-ink-muted)] max-w-3xl mt-1 leading-relaxed">
              Wholesale lot sellers routinely post "Sold / Advance Received" screenshots with masked buyer digits. We cross-reference visible digits against verified group participants to identify genuine buyers, enabling 1-click verification before you send any advance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-[20px] bg-[var(--wa-surface-subtle)] border border-[#25D366]/40 text-center min-w-[130px]">
              <div className="text-2xl font-normal text-[#25D366]">
                {data.high_confidence_matches} / {data.total_receipts_audited}
              </div>
              <div className="text-[10px] text-[var(--wa-ink-muted)] uppercase tracking-wider mt-0.5">
                90%+ Confidence
              </div>
            </div>
            <div className="p-3.5 rounded-[20px] bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] text-center min-w-[130px]">
              <div className="text-2xl font-normal text-[var(--wa-ink)]">100%</div>
              <div className="text-[10px] text-[var(--wa-ink-muted)] uppercase tracking-wider mt-0.5">
                Zero-Loss Policy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice Callout */}
      <div className="p-4 rounded-[20px] bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-700 dark:text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong className="font-normal text-amber-600 dark:text-amber-300">Mandatory Verification Protocol: </strong>
          Wholesale lots carry significant counterparty risk. Before depositing any advance to unverified vendors, click <strong>"Verify with Buyer"</strong> below to send a respectful inquiry to the actual customer who previously paid them.
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="bg-[var(--wa-surface)] rounded-[25px] overflow-hidden border border-[var(--wa-border)] shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[var(--wa-surface-subtle)] border-b border-[var(--wa-border)] text-[11px] uppercase tracking-wider text-[var(--wa-ink-muted)] font-normal">
                <th className="py-4 px-4 w-28">Receipt ID</th>
                <th className="py-4 px-4 w-60">Seller & Group</th>
                <th className="py-4 px-4 w-48">Payment Slip Data</th>
                <th className="py-4 px-4 w-44">OCR Extracted Digits</th>
                <th className="py-4 px-4 w-60">Matched Group Member</th>
                <th className="py-4 px-4 w-32">Confidence</th>
                <th className="py-4 px-4 text-right w-64">1-Click Buyer Inquiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--wa-border)] text-xs text-[var(--wa-ink)]">
              {data.verification_receipts.map((receipt: VerificationReceipt) => {
                const isHighConfidence = receipt.confidence_score >= 90;
                return (
                  <tr key={receipt.id} className="hover:bg-[var(--wa-surface-subtle)] transition-colors">
                    {/* ID & Screenshot Ref */}
                    <td className="py-4 px-4 text-[var(--wa-ink)] font-normal">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>{receipt.id}</span>
                      </div>
                      <div className="text-[10px] text-[var(--wa-ink-muted)] mt-1 truncate max-w-[120px]" title={receipt.receipt_image_ref}>
                        {receipt.receipt_image_ref}
                      </div>
                    </td>

                    {/* Seller & Group */}
                    <td className="py-4 px-4">
                      <div className="text-[var(--wa-ink)] font-normal flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-amber-500" />
                        <span>{receipt.seller_name}</span>
                      </div>
                      <div className="text-[11px] text-[var(--wa-ink-muted)] mt-0.5">
                        +{receipt.seller_phone}
                      </div>
                      <div className="text-[10px] text-[#25D366] mt-1 font-normal">
                        {receipt.group_name}
                      </div>
                    </td>

                    {/* Payment Slip Info */}
                    <td className="py-4 px-4">
                      <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] bg-[#005C4B]/20 text-[#25D366] border border-[#25D366]/30">
                        {receipt.wallet_type}
                      </div>
                      <div className="text-sm font-normal text-[#25D366] mt-1">
                        {currencySymbol} {receipt.amount_pkr.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[var(--wa-ink-muted)] mt-0.5">
                        {receipt.item_purchased}
                      </div>
                      <div className="text-[9px] text-[var(--wa-ink-muted)]">
                        TRX: {receipt.trx_id}
                      </div>
                    </td>

                    {/* Extracted Digits */}
                    <td className="py-4 px-4">
                      <span className="font-mono px-2.5 py-1 rounded-full bg-[var(--wa-surface-subtle)] border border-[var(--wa-border)] text-amber-500 text-xs">
                        {receipt.extracted_partial_digits}
                      </span>
                      <div className="text-[10px] text-[var(--wa-ink-muted)] mt-1">
                        {receipt.transaction_timestamp}
                      </div>
                    </td>

                    {/* Matched Member */}
                    <td className="py-4 px-4">
                      <div className="text-[var(--wa-ink)] font-normal flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>{receipt.top_candidate_name}</span>
                      </div>
                      <div className="font-mono text-[var(--wa-ink-muted)] text-[11px] mt-0.5">
                        +{receipt.top_candidate_phone}
                      </div>
                      <p className="text-[10px] text-[var(--wa-ink-muted)] mt-1 leading-snug">
                        {receipt.candidate_matches[0]?.match_reason}
                      </p>
                    </td>

                    {/* Confidence % */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-normal text-sm px-2.5 py-1 rounded-full ${
                            isHighConfidence
                              ? 'bg-[#005C4B]/20 text-[#25D366] border border-[#25D366]/40'
                              : 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                          }`}
                        >
                          {receipt.confidence_score}%
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--wa-ink-muted)] block mt-1">
                        {isHighConfidence ? 'High Certainty' : 'Probable Match'}
                      </span>
                    </td>

                    {/* Direct 1-Click Verification Link */}
                    <td className="py-4 px-4 text-right">
                      <a
                        href={receipt.verification_wa_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-[#111B21] font-normal text-xs transition-all shadow-md shadow-[#25D366]/20"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Verify with Buyer</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                      <div className="text-[10px] text-[var(--wa-ink-muted)] mt-1.5 italic max-w-xs ml-auto line-clamp-1" title={receipt.verification_message_text}>
                        "{receipt.verification_message_text.slice(0, 48)}..."
                      </div>
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
