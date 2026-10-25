# WhatsApp Deal Radar: Al-Rahim Mobile Market Duplication Audit Report

**Group:** Al __ Raheem mobile mart ✅📱 (`120363291118991272@g.us`)  
**Seller:** Muhammad Hamza (`+92 315 0477792`)  
**Physical Hub:** Godam #65, Al Raheem Electronic Mobile, Quetta Russi Market, Pakistan  
**Audit Date:** 2026-10-25 17:52:55  

---

## 1. Executive Summary

| Metric | Value | Meaning |
| :--- | :--- | :--- |
| **Total Ingested Messages** | **73** | Complete message history stored in SQLite |
| **Text Postings** | **1** | Full spec hardware listing (Dell XPS 17 9700) |
| **Media Attachments (Images/Video)** | **72** | Product photos, spec labels, lot overviews |
| **Unique SHA-256 Images** | **66** | Distinct visual assets |
| **Internal Duplicates Inside Group** | **6 Pairs (12 Messages)** | Exact same image resent in multiple bursts |
| **Identical Burst Cross-Post** | **Burst 7 (12:10) vs Burst 8 (13:13)** | 6 images repeated 1 hour later with 0 changes |
| **Cross-Chat Duplicates with 1-on-1 DM** | **3 Assets** | Same media sent to group and private chat |
| **Removable Redundant Messages** | **6 Messages (8.2%)** | Safe to prune for clean catalog ingestion |

---

## 2. Detailed Internal Duplication Breakdown (Exact SHA-256 Matches)

The following 6 images were sent multiple times in the group. Notice the identical SHA-256 fingerprint and file length:

| # | SHA-256 Fingerprint | File Name | Size (Bytes) | First Broadcast | Second Broadcast | Time Delta |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `DAE79208758DBD1C...` | `image_20261022_121054.jpg` | 85,798 | 12:10:52 PKT | 13:13:49 PKT | **+1 hr 2 min** |
| 2 | `B7A69408B62BCF8D...` | `image_20261022_121105.jpg` | 148,910 | 12:11:03 PKT | 13:13:50 PKT | **+1 hr 2 min** |
| 3 | `70373C95ADC9C308...` | `image_20261022_121110.jpg` | 127,663 | 12:11:08 PKT | 13:13:51 PKT | **+1 hr 2 min** |
| 4 | `1FAFFCA25BDBB29D...` | `image_20261022_121117.jpg` | 108,202 | 12:11:16 PKT | 13:13:51 PKT | **+1 hr 2 min** |
| 5 | `761892AA30AA3CFC...` | `image_20261022_121124.jpg` | 248,259 | 12:11:22 PKT | 13:13:52 PKT | **+1 hr 2 min** |
| 6 | `A3F9D01719C60956...` | `image_20261022_121139.jpg` | 103,933 | 12:11:38 PKT | 13:13:52 PKT | **+1 hr 2 min** |

> **Audit Insight:** The entire batch sent at 12:10 PM was re-broadcast verbatim at 1:13 PM to bump visibility in buyer notifications. By deduplicating, our system collapses these 12 messages into 6 unique products.

---

## 3. Direct Message Cross-Chat Correlation

The seller Muhammad Hamza also contacted the buyer directly in `83877188120594@lid`.
- **Shared Media 1 (SHA `EE779037...`):** Sent in group at 10:51:56 PKT, sent in private DM at 11:04:53 PKT.
- **Shared Media 2 (SHA `D58E620E...`):** Sent in group at 10:52:06 PKT, sent in private DM at 11:05:07 PKT.
- **Direct Location Disclosure:** *"Quetta RUSSI market Pakistan godam number 65 Al Raheem electronic mobile 📲"*

---

## 4. Deduplication Strategy & Shopify Normalization

1. **Keep First Occurrence:** For duplicate media, the earlier message timestamp is preserved as the official listing creation date.
2. **Metadata Consolidation:** The second message ID is cataloged under `duplicate_of_message_id` with duplicate count `2`.
3. **Shopify Product Assembly:** Redundant photos are combined into single product galleries (e.g. Dell XPS 17 9700 has 1 spec text + 9 unique angle photos).
