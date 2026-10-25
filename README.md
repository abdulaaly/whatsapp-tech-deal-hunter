# WhatsApp Universal Deal Radar & Market Intelligence Engine ⚡📱💻

[![Official WhatsApp Design](https://img.shields.io/badge/Design%20System-WhatsApp%20DESIGN.md-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://www.shadcn.io/design/whatsapp)
[![Architecture](https://img.shields.io/badge/Architecture-Universal%20Multi--Business-00A884?style=for-the-badge)](https://github.com/abdulaaly/whatsapp-tech-deal-hunter)
[![Live Sync](https://img.shields.io/badge/Live%20Sync-SQLite%20Port%208765-25D366?style=for-the-badge)](https://github.com/abdulaaly/whatsapp-tech-deal-hunter)
[![Safety Protocol](https://img.shields.io/badge/Safety-100%25%20Read--Only%20Protocol-128C7E?style=for-the-badge)](https://github.com/abdulaaly/whatsapp-tech-deal-hunter)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **Autonomous WhatsApp Deal Extraction, Multi-Group Duplicate Price Comparison, Real-Time Live Sync & Universal Multi-Business Intelligence Platform** — built directly in strict adherence to the official `whatsapp.design.md` design specification and connected to real WhatsApp SQLite message stores (`messages.db` & `whatsapp.db`).

---

## 🌟 Key Capabilities & Architectural Innovations

### 1. 🎨 100% Compliance with `whatsapp.design.md`
Designed and verified against the official WhatsApp Design System specification (`DESIGN.md` / `whatsapp.design.md`):
- **Dual-Band Canvas Philosophy**:
  - **Warm Cream Canvas (`#FCF5EB`)**: The signature WhatsApp public marketing floor with `#1C1E21` dark ink and `#FFFFFF` cards, giving `#25D366` green CTAs a friendly, approachable contrast.
  - **Encryption Dark Canvas (`#111B21`)**: The official WhatsApp Web / Mobile dark surface with `#202C33` tiles, `#2A3942` borders, and `#25D366` green pills.
- **Uniform 400 Weight Typography**: WhatsApp Sans Var & Inter at strict weight `400` throughout all tiers (no bold/semibold). Visual hierarchy is created strictly through scale and contrast.
- **50px Pill Radii**: All interactive buttons, chips, and tags feature `50px` pill curvature, while containers round at `25px` and avatars at `50%` circles.

### 2. 🏢 Universal Multi-Business & Industry Niche Architecture
Engineered so that **ANY business owner, trader, or shopkeeper in any country** can use this platform on their own WhatsApp data:
- **Built-in Industry Presets**:
  1. **Tech & Laptop Wholesale Importer**: Laptops, MacBooks, Flagships & Components (Karachi Saddar, Hafeez Center Lahore, Quetta Godam).
  2. **Smartphone & Gadgets Trader**: Used Flagships, Box-Packed, Non-PTA, JV Kits, Apple & Samsung.
  3. **Solar & Energy Equipment Distributor**: Hybrid Inverters (6kW–12kW), Tier-1 Bifacial Solar Panels, LiFePO4 Lithium Batteries.
  4. **Automobile & Japanese Spares Importer**: Kabli Engines, Automatic Gearboxes, Half-Cuts, Alloy Rims (Shershah Karachi, Chaman border).
  5. **Custom Multi-Niche Arbitrage Hunter**: Fully configurable for any trade (textiles, real estate, general wholesale, machinery).
- **Custom Niche Configurator**: Edit categories on the fly, set custom target profit margin % (5% to 50%), and select trade currencies (PKR, USD, AED, SAR, EUR, GBP, INR).

### 3. 📥 Universal WhatsApp Chat Export Importer (.txt / Drag & Drop)
Any business owner on Android, iPhone, or WhatsApp Desktop can export any chat or group (*More → Export Chat without media*) and drop the `.txt` file into the dashboard:
- Auto-extracts product titles, specifications (RAM, SSD, CPU, Condition), prices, and seller phone numbers.
- Handles standard multi-lingual WhatsApp export formats across English, Urdu, Hindi, and Arabic.
- Generates pre-filled `wa.me` links with context-aware inquiry messages.

### 4. ⚡ Real-Time Live Sync Engine (`backend/live_sync_server.py`)
- Python HTTP & Live Sync Server running on port `8765`.
- Directly connects to WhatsApp Desktop SQLite store:
  - `messages.db`: 324+ real messages, 28 active chats.
  - `whatsapp.db`: 5,374 contacts and LID phone mapping.
- **Instant "Sync Now" button**: Polls SQLite for new messages, re-extracts deals, and pushes live updates to the React dashboard with real-time toast feedback.
- **Live Message Stream Drawer**: Explorable real-time feed showing actual raw incoming messages with sender phone numbers, timestamps, and WhatsApp message IDs.

### 5. 🔍 Multi-Group Duplicate Price Comparison
- Tracks identical products broadcast across multiple groups (e.g. Quetta Godam #65 vs Karachi Star City Mall).
- Highlights price discrepancies and surfaces the **`⭐ CHEAPEST LOT OFFER`** with guaranteed savings.

### 6. 🛡️ Payment-Screenshot Buyer Legitimacy Verification
- Audits payment slips (Easypaisa, JazzCash, Raast, Bank Transfer) posted by sellers.
- Matches partially masked numbers against 5,374 group participants.
- Provides 1-click verification links to query previous buyers before depositing any advance.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js 18+ & npm
- Python 3.10+ (for live sync server)

### 2. Start the Real-Time Live Sync Server
```bash
cd backend
python live_sync_server.py
```
*Server runs on `http://127.0.0.1:8765` and connects to `messages.db` and `whatsapp.db`.*

### 3. Start the Interactive Frontend Dashboard
```bash
cd dashboard
npm install
npm run dev
```
*Open `http://127.0.0.1:5173/` in your browser.*

---

## 📂 Project Structure

```
tech-deal-hunter/
├── DESIGN.md                               # Official WhatsApp Design System tokens (exact match of whatsapp.design.md)
├── whatsapp.design.md                      # Downloaded WhatsApp design spec
├── README.md                               # Platform documentation
├── backend/
│   ├── live_sync_server.py                 # Real-time HTTP & SQLite live sync server (port 8765)
│   ├── generate_real_cross_group_dataset.py# Real dataset generator & normalizer
│   ├── inspect_dbs.py                      # SQLite database inspector
│   ├── dump_messages.py                    # WhatsApp message dumper with phone resolution
│   └── data/                               # Generated JSON datasets
├── dashboard/
│   ├── src/
│   │   ├── App.tsx                         # Core application state & modal orchestration
│   │   ├── index.css                       # WhatsApp tokens (Warm Cream & Encryption Dark)
│   │   ├── types/
│   │   │   ├── index.ts                    # Tech product & verification types
│   │   │   └── business.ts                 # Business profile & industry presets
│   │   ├── utils/
│   │   │   └── whatsappChatParser.ts       # Universal WhatsApp .txt chat export parser
│   │   └── components/
│   │       ├── Header.tsx                  # Top toolbar with live sync, theme & niche switcher
│   │       ├── CategoryTabs.tsx            # Dynamic category pill navigation
│   │       ├── HardwareTable.tsx           # Multi-group comparison table with price deltas
│   │       ├── DetailModal.tsx             # Granular modal with cross-post breakdown
│   │       ├── BusinessProfileModal.tsx    # Multi-business niche & margin configurator
│   │       ├── ChatImportModal.tsx         # Universal drag & drop chat export importer
│   │       ├── LiveMessageFeedDrawer.tsx   # Live WhatsApp SQLite message stream drawer
│   │       ├── BuyerVerificationTab.tsx    # Payment slip buyer verification queue
│   │       └── VoiceAIAssistant.tsx        # Real-time Voice AI calling assistant
```

---

## 🔒 Safety & Read-Only Protocol
This application operates on a **strict zero-risk read-only protocol**:
- Never sends automated outbound messages or spam to WhatsApp chats.
- All inquiries are generated as standard pre-filled `wa.me` links requiring explicit human review before sending.
- Local SQLite access operates in read-only connection mode.
