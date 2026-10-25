import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

data_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\tech-deal-hunter\backend\data"
reports_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\tech-deal-hunter\reports"
os.makedirs(reports_dir, exist_ok=True)

rankings_file = os.path.join(data_dir, "enriched_rankings.json")
verification_file = os.path.join(data_dir, "buyer_verification_queue.json")

with open(rankings_file, "r", encoding="utf-8") as f:
    rankings_data = json.load(f)

with open(verification_file, "r", encoding="utf-8") as f:
    verification_data = json.load(f)

md = []
md.append("# WhatsApp Tech Deal Radar & Seller Legitimacy Verification Audit")
md.append("## Executive Multi-Category Hardware Evaluation & Buyer Trust Intelligence")
md.append(f"**Generated:** {rankings_data['generated_at']} | **Total Cataloged Listings:** {rankings_data['total_listings']} | **Active Groups Audited:** 8\n")
md.append("---\n")

md.append("### Executive Summary")
md.append("This report presents the comprehensive end-to-end extraction, deduplication, benchmark enrichment, and cell-by-cell star rating analysis of tech product listings harvested from WhatsApp wholesale and lot channels across Pakistan (Quetta Lot Prime, Al-Raheem Mobile Mart, Syed Online Products, Online Product Sellar, etc.).")
md.append("In addition, this report delivers an **independent Buyer Verification & Seller Trust Audit**, parsing partially obscured Easypaisa, JazzCash, and Raast transfer screenshots via native Windows OCR and cross-referencing extracted digits against 5,374 registered WhatsApp group participants to establish concrete legitimacy before funds are transferred.\n")
md.append("---\n")

for cat_name, cat_obj in rankings_data["categories"].items():
    meta = cat_obj["meta"]
    items = cat_obj["items"]
    
    md.append(f"## {meta['title']} ({len(items)} Models Ranked)")
    md.append(f"*{meta['description']}*\n")
    md.append(f"- **Top Recommended Pick:** {meta['top_pick']}")
    md.append(f"- **Best Value Lot Pick:** {meta['value_pick']}\n")
    
    # Granular Comparison Table
    md.append("| Rank | Model & Core Specs | Price & Value | Chip & CPU Architecture | GPU & Compute | RAM / Unified | Storage | Display Tech | Battery & Health | Condition & Box | Seller & 1-Click WhatsApp |")
    md.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
    
    for it in items:
        sr = it["star_ratings"]
        bm = it["benchmarks"]
        seller_link = f"[{it['seller_name']} (+{it['seller_phone']})]({it['direct_wa_link']})"
        
        row = (
            f"| **{it['rank']}** "
            f"| **{it['model_name']}**<br><small>{it['category']}</small> "
            f"| **PKR {it['price_pkr']:,}**<br>{sr['price_value']} "
            f"| {it['chip']}<br>{sr['chip_cpu']}<br><small>GB6: {bm.get('geekbench_multi', 'N/A')}</small> "
            f"| {it['gpu']}<br>{sr['gpu']} "
            f"| {it['ram']}<br>{sr['ram']} "
            f"| {it['storage']}<br>{sr['storage']} "
            f"| {it['display']}<br>{sr['display']} "
            f"| {it['battery_health']}<br>{sr['battery']} "
            f"| {it['condition']}<br>{sr['condition']}<br><small>Warranty: {it['warranty']}</small> "
            f"| {seller_link}<br><small>Group: {', '.join(it['source_groups'])}</small> |"
        )
        md.append(row)
        
    md.append("\n### Granular Recommendation Analysis:")
    for it in items:
        md.append(f"- **{it['rank']} - {it['model_name']}** (Overall Score: {it['star_ratings']['overall_score']} ⭐): {it['ranking_rationale']}")
    
    md.append("\n---\n")

# Buyer Verification Section
md.append("## 🛡️ Seller Legitimacy & Payment Screenshot Verification Pipeline")
md.append("Wholesale sellers in Pakistani lot groups frequently post screenshots of Easypaisa, JazzCash, or Bank receipts with buyer numbers partially obscured to establish credibility. Below is the automated cross-reference matching these slips against group participants:\n")

md.append("| Receipt ID | Seller Name & Number | Payment Platform | Amount (PKR) | Extracted Partial Digits | Matched Group Member | Match Confidence | Pre-Filled Verification Inquiry |")
md.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |")

for r in verification_data["verification_receipts"]:
    cand = r["candidate_matches"][0]
    wa_btn = f"[Verify via WhatsApp (+{cand['phone']})]({r['verification_wa_link']})"
    seller_ref = f"{r['seller_name']}<br><small>+{r['seller_phone']}</small>"
    
    row = (
        f"| **{r['id']}** "
        f"| {seller_ref} "
        f"| **{r['wallet_type']}**<br><small>TRX: {r['trx_id']}</small> "
        f"| PKR {r['amount_pkr']:,}<br><small>{r['item_purchased']}</small> "
        f"| `{r['extracted_partial_digits']}` "
        f"| **{cand['name']}**<br>`+{cand['phone']}`<br><small>{cand['match_reason']}</small> "
        f"| **{cand['confidence_pct']}%** "
        f"| {wa_btn} |"
    )
    md.append(row)

md.append("\n### Verification Protocol Guidance")
md.append("> [!IMPORTANT]")
md.append("> **Safe Inquiry Standard:** When verifying an unknown seller with a past buyer, always use non-accusatory, polite inquiry phrasing:")
md.append("> *\"Assalam-o-Alaikum bro, I saw your payment confirmation in [Group Name] with [Seller]. Did you receive your parcel safely, and how was your experience with this seller?\"*")
md.append("> Never transfer full funds in advance to newly joined sellers without positive confirmation from at least 1 verified buyer or a video parcel packing verification.")

report_path = os.path.join(reports_dir, "comprehensive_tech_comparison_report.md")
with open(report_path, "w", encoding="utf-8") as f:
    f.write("\n".join(md))

print(f"Report generated successfully at: {report_path}")
print(f"Total lines: {len(md)}")
