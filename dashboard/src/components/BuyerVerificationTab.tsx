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
}

export const BuyerVerificationTab: React.FC<BuyerVerificationTabProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Verification Header Banner */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden border border-emerald-800/60 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Seller Legitimacy Audit
              </span>
              <span className="text-xs text-slate-400">
                Native WinRT OCR & Group Cross-Match Pipeline
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Payment Screenshot Buyer Verification Queue
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Pakistani lot sellers routinely post "Alhamdulillah Sold / Order Confirmed" screenshots from Easypaisa, JazzCash, and Raast with buyer digits partially masked. We cross-reference visible digits against 5,374 group participants to identify genuine buyers, enabling 1-click verification before you send any advance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-center">
              <div className="text-2xl font-black text-emerald-400">
                {data.high_confidence_matches} / {data.total_receipts_audited}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                90%+ Confidence Matches
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-center">
              <div className="text-2xl font-black text-indigo-400">100%</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">
                Zero-Loss Policy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice Callout */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-300">Mandatory Verification Protocol: </strong>
          Wholesale lots carry significant counterparty risk. Before depositing any half-advance to sellers like Al-Raheem Mobile Mart or Online Product Sellar, click <strong>"Verify with Buyer"</strong> below to send a respectful inquiry to the actual customer who previously paid them.
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-900/95 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                <th className="py-4 px-4 w-28">Receipt ID</th>
                <th className="py-4 px-4 w-60">Seller & Group</th>
                <th className="py-4 px-4 w-48">Payment Slip Data</th>
                <th className="py-4 px-4 w-44">OCR Extracted Digits</th>
                <th className="py-4 px-4 w-60">Matched Group Member</th>
                <th className="py-4 px-4 w-32">Confidence</th>
                <th className="py-4 px-4 text-right w-64">1-Click Buyer Inquiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {data.verification_receipts.map((receipt: VerificationReceipt) => {
                const isHighConfidence = receipt.confidence_score >= 90;
                return (
                  <tr key={receipt.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* ID & Screenshot Ref */}
                    <td className="py-4 px-4 font-bold text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{receipt.id}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[120px]" title={receipt.receipt_image_ref}>
                        {receipt.receipt_image_ref}
                      </div>
                    </td>

                    {/* Seller & Group */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-amber-400" />
                        <span>{receipt.seller_name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        +{receipt.seller_phone}
                      </div>
                      <div className="text-[10px] text-indigo-400 mt-1 font-medium">
                        {receipt.group_name}
                      </div>
                    </td>

                    {/* Payment Slip Info */}
                    <td className="py-4 px-4">
                      <div className="inline-block px-2 py-0.5 rounded-md font-bold text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {receipt.wallet_type}
                      </div>
                      <div className="text-sm font-extrabold text-emerald-400 mt-1">
                        PKR {receipt.amount_pkr.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {receipt.item_purchased}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        TRX: {receipt.trx_id}
                      </div>
                    </td>

                    {/* Extracted Digits */}
                    <td className="py-4 px-4">
                      <span className="font-mono px-2 py-1 rounded bg-slate-950 border border-slate-700 text-amber-300 text-xs font-semibold">
                        {receipt.extracted_partial_digits}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {receipt.transaction_timestamp}
                      </div>
                    </td>

                    {/* Matched Member */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{receipt.top_candidate_name}</span>
                      </div>
                      <div className="font-mono text-slate-300 text-[11px] mt-0.5">
                        +{receipt.top_candidate_phone}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        {receipt.candidate_matches[0].match_reason}
                      </p>
                    </td>

                    {/* Confidence % */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-black text-sm px-2.5 py-1 rounded-xl ${
                            isHighConfidence
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {receipt.confidence_score}%
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {isHighConfidence ? 'High Certainty' : 'Probable Match'}
                      </span>
                    </td>

                    {/* Direct 1-Click Verification Link */}
                    <td className="py-4 px-4 text-right">
                      <a
                        href={receipt.verification_wa_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/25 ring-1 ring-white/20"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Verify with Buyer</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                      <div className="text-[10px] text-slate-400 mt-1.5 italic max-w-xs ml-auto line-clamp-1" title={receipt.verification_message_text}>
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
