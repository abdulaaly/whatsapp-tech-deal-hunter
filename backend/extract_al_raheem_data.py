import sqlite3
import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')
store_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"
conn_msg = sqlite3.connect(os.path.join(store_dir, "messages.db"))
cur_msg = conn_msg.cursor()
conn_wa = sqlite3.connect(os.path.join(store_dir, "whatsapp.db"))
cur_wa = conn_wa.cursor()

# Get contacts map
cur_wa.execute("SELECT their_jid, push_name, full_name, business_name FROM whatsmeow_contacts")
contacts_map = {r[0]: (r[1] or r[2] or r[3] or r[0]) for r in cur_wa.fetchall()}

# Get LID map
cur_wa.execute("SELECT lid, pn FROM whatsmeow_lid_map")
lid_map = {r[0]: r[1] for r in cur_wa.fetchall()}

# Fetch all messages for Al Raheem group
chat_jid = '120363291118991272@g.us'
cur_msg.execute("""
    SELECT id, chat_jid, sender, content, timestamp, is_from_me, media_type, filename, url, 
           hex(file_sha256) as sha256, hex(file_enc_sha256) as enc_sha256, file_length
    FROM messages
    WHERE chat_jid = ?
    ORDER BY timestamp ASC
""", (chat_jid,))
group_messages = cur_msg.fetchall()

print(f"Total messages in Al Raheem group: {len(group_messages)}")

# Also fetch direct messages with Muhammad Hamza (83877188120594@lid)
cur_msg.execute("""
    SELECT id, chat_jid, sender, content, timestamp, is_from_me, media_type, filename, url, 
           hex(file_sha256) as sha256, hex(file_enc_sha256) as enc_sha256, file_length
    FROM messages
    WHERE chat_jid = '83877188120594@lid'
    ORDER BY timestamp ASC
""")
dm_messages = cur_msg.fetchall()
print(f"Total messages in Al Raheem Direct Messages: {len(dm_messages)}")

all_records = []
for m in group_messages:
    sender_clean = m[2]
    sender_pn = lid_map.get(sender_clean, sender_clean)
    sender_name = contacts_map.get(f"{sender_clean}@lid", contacts_map.get(f"{sender_pn}@s.whatsapp.net", "Muhammad Hamza (Al-Rahim Mart)"))
    rec = {
        "id": m[0],
        "chat_jid": m[1],
        "chat_name": "Al __ Raheem mobile mart ✅📱",
        "sender_id": m[2],
        "sender_phone": f"+{sender_pn}" if sender_pn.isdigit() else sender_pn,
        "sender_name": sender_name,
        "content": m[3],
        "timestamp": m[4],
        "is_from_me": bool(m[5]),
        "media_type": m[6],
        "filename": m[7],
        "url": m[8],
        "sha256": m[9],
        "enc_sha256": m[10],
        "file_length_bytes": m[11]
    }
    all_records.append(rec)

# Analyze duplication
sha_counts = {}
for r in all_records:
    sha = r["sha256"]
    if sha:
        sha_counts[sha] = sha_counts.get(sha, 0) + 1

print("\n--- Internal Duplicate SHAs inside Al Raheem ---")
internal_dups = {k: v for k, v in sha_counts.items() if v > 1}
print(f"Found {len(internal_dups)} duplicate images in group")
for sha, cnt in internal_dups.items():
    print(f"  SHA {sha[:16]}... appears {cnt} times")

# Cross-chat duplicates between group and DM
group_shas = set(r["sha256"] for r in all_records if r["sha256"])
dm_dups = []
for dm in dm_messages:
    sha = dm[9]
    if sha and sha in group_shas:
        dm_dups.append(dm)
print(f"\nCross-chat duplicates between Al Raheem group and DM: {len(dm_dups)} shared media files")
