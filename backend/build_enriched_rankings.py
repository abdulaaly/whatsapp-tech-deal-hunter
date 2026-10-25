import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

data_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\tech-deal-hunter\backend\data"
input_file = os.path.join(data_dir, "normalized_tech_listings.json")
output_file = os.path.join(data_dir, "enriched_rankings.json")

with open(input_file, "r", encoding="utf-8") as f:
    listings = json.load(f)

categories = [
    "MacBook Series",
    "iPhones",
    "Other Mobiles",
    "HP Spectre & HP Laptops",
    "General Laptops"
]

category_summaries = {
    "MacBook Series": {
        "title": "MacBook Series (Pro & Air)",
        "description": "Apple Silicon (M1, M2, M2 Max, M1 Pro) laptops compared across Unified Memory bandwidth, thermal architecture, ProMotion 120Hz displays, and sustained rendering workloads.",
        "top_pick": "Apple MacBook Pro 16\" (M2 Max) - 38-Core GPU / 400 GB/s Bandwidth",
        "value_pick": "Apple MacBook Pro 14\" (M1 Pro) - Sub-300K PKR with 120Hz Liquid Retina XDR"
    },
    "iPhones": {
        "title": "Apple iPhones",
        "description": "iPhone 12 Pro through 15 Pro Max compared across A-series chip tier, camera zoom systems, Dynamic Island, PTA approval tax status, and battery cycle health.",
        "top_pick": "Apple iPhone 15 Pro Max (256GB Natural Titanium) - 3nm A17 Pro with USB-C 10Gbps",
        "value_pick": "Apple iPhone 14 Pro (128GB Deep Purple) - Official Lifetime PTA Approved"
    },
    "Other Mobiles": {
        "title": "Other Mobiles (Android Flagships)",
        "description": "Top-tier Android smartphones compared across Snapdragon 8 Gen 2/3 vs Google Tensor G3, display nits, fast charging wattage, camera sensors, and PTA status.",
        "top_pick": "Samsung Galaxy S24 Ultra (512GB) - Anti-reflective Gorilla Armor Flat & Snapdragon 8 Gen 3",
        "value_pick": "OnePlus 12 (16GB/512GB) - 4500 nits display + 100W SuperVOOC charger in box"
    },
    "HP Spectre & HP Laptops": {
        "title": "HP Spectre & HP Series Laptops",
        "description": "HP's premium x360 convertible convertibles, Omen desktop-class gaming rigs, and enterprise EliteBooks compared across display aspect ratios, thermals, and upgradability.",
        "top_pick": "HP Spectre x360 14 (2024 AI Edition) - Intel Core Ultra 7 155H with 2.8K 120Hz OLED",
        "value_pick": "HP Spectre x360 13.5 Gem-Cut - 3:2 Tall productivity display at 125K PKR"
    },
    "General Laptops": {
        "title": "General Laptops (Dell, Lenovo, Alienware)",
        "description": "High-performance Windows machines compared across discrete GPU wattage (RTX 5070Ti vs 4070 vs GTX 2060), dual-channel RAM expandability, vapor chamber thermals, and color-accurate 4K panels.",
        "top_pick": "Lenovo Legion Pro 7i 16\" (2025) - Core Ultra 9 275HX + RTX 5070Ti Beast",
        "value_pick": "Dell XPS 13 Plus 9320 - Seamless glass haptic touchpad + 32GB RAM at 148K PKR"
    }
}

structured_output = {
    "generated_at": "2026-10-25T14:48:00+05:00",
    "total_categories": len(categories),
    "total_listings": len(listings),
    "categories": {}
}

for cat in categories:
    cat_items = [x for x in listings if x["category"] == cat]
    # Sort by overall score descending
    cat_items.sort(key=lambda x: x["star_ratings"]["overall_score"], reverse=True)
    
    # Assign explicit rank index
    for idx, item in enumerate(cat_items, 1):
        item["rank"] = f"#{idx}"
        item["direct_wa_link"] = f"https://wa.me/{item['seller_phone']}"
        item["group_link"] = f"https://chat.whatsapp.com/invite/{item['source_groups'][0]}"
        
    structured_output["categories"][cat] = {
        "meta": category_summaries.get(cat, {}),
        "count": len(cat_items),
        "items": cat_items
    }

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(structured_output, f, indent=2, ensure_ascii=False)

print(f"Phase 3 Complete!")
print(f"Enriched and ranked {len(listings)} listings across {len(categories)} categories.")
for cat, data in structured_output["categories"].items():
    print(f"\n--- {cat} ({data['count']} items) ---")
    for it in data["items"]:
        print(f"  {it['rank']} - {it['model_name']} | Overall: {it['star_ratings']['overall_score']} ⭐ | Price: {it['price_pkr']:,} PKR | Seller: {it['seller_name']}")
