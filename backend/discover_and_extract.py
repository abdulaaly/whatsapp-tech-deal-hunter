import sqlite3
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

messages_db_path = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store\messages.db"
whatsapp_db_path = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store\whatsapp.db"

output_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\tech-deal-hunter\backend\data"
os.makedirs(output_dir, exist_ok=True)

# 1. Connect to whatsapp.db for Contacts and LID map
w_conn = sqlite3.connect(f"file:{whatsapp_db_path}?mode=ro", uri=True)
w_cur = w_conn.cursor()

w_cur.execute("SELECT lid, pn FROM whatsmeow_lid_map;")
lid_to_pn = {}
for lid, pn in w_cur.fetchall():
    lid_to_pn[str(lid)] = str(pn)
    lid_to_pn[f"{lid}@lid"] = str(pn)

w_cur.execute("SELECT their_jid, first_name, full_name, push_name, business_name FROM whatsmeow_contacts;")
contacts = {}
for jid, fn, fulln, pushn, bname in w_cur.fetchall():
    name = fulln or fn or pushn or bname or ""
    contacts[str(jid)] = {
        "name": name,
        "push_name": pushn or "",
        "business_name": bname or ""
    }
w_conn.close()

# 2. Connect to messages.db for Chats and Messages
m_conn = sqlite3.connect(f"file:{messages_db_path}?mode=ro", uri=True)
m_cur = m_conn.cursor()

m_cur.execute("SELECT jid, name FROM chats;")
chats = dict(m_cur.fetchall())

m_cur.execute("""
    SELECT id, chat_jid, sender, content, timestamp, media_type, filename, url, file_length
    FROM messages
    ORDER BY timestamp ASC;
""")
messages = m_cur.fetchall()
m_conn.close()

def resolve_sender(sender_jid):
    clean = str(sender_jid).replace('@lid', '').replace('@s.whatsapp.net', '')
    phone = ""
    if clean in lid_to_pn:
        phone = lid_to_pn[clean]
    elif sender_jid in lid_to_pn:
        phone = lid_to_pn[sender_jid]
    elif '@s.whatsapp.net' in str(sender_jid) or (clean.isdigit() and len(clean) >= 10):
        phone = clean

    contact_name = ""
    for try_jid in [sender_jid, f"{clean}@s.whatsapp.net", f"{phone}@s.whatsapp.net", f"{clean}@lid"]:
        if try_jid in contacts and contacts[try_jid]["name"]:
            contact_name = contacts[try_jid]["name"]
            break

    return phone, contact_name

# Target tech/lot groups
target_keywords = ['lot', 'prime', 'sellar', 'product', 'laptop', 'e-commerce', 'voltan', 'mart', 'market', 'mobile']
target_groups = {}
for jid, name in chats.items():
    name_str = str(name or "")
    if any(k in name_str.lower() for k in target_keywords):
        target_groups[jid] = {
            "jid": jid,
            "name": name_str,
            "invite_link": f"https://chat.whatsapp.com/invite/{jid.split('@')[0]}",
            "message_count": 0,
            "participants": set()
        }

cataloged_messages = []
for m in messages:
    mid, chat_jid, sender, content, ts, media_type, fname, url, flen = m
    phone, contact_name = resolve_sender(sender)
    cname = chats.get(chat_jid, chat_jid)
    
    if chat_jid in target_groups:
        target_groups[chat_jid]["message_count"] += 1
        if phone:
            target_groups[chat_jid]["participants"].add(phone)
            
    cataloged_messages.append({
        "id": mid,
        "chat_jid": chat_jid,
        "chat_name": cname,
        "sender_jid": sender,
        "resolved_phone": phone,
        "contact_name": contact_name,
        "content": content or "",
        "timestamp": str(ts),
        "media_type": media_type or "",
        "filename": fname or "",
        "file_length": flen or 0
    })

# Convert sets to lists
for jid in target_groups:
    target_groups[jid]["participants"] = sorted(list(target_groups[jid]["participants"]))

discovery_report = {
    "total_contacts_in_db": len(contacts),
    "total_lid_mappings": len(lid_to_pn),
    "total_chats": len(chats),
    "total_messages": len(messages),
    "target_groups": target_groups,
    "cataloged_messages": cataloged_messages
}

with open(os.path.join(output_dir, "discovered_groups_and_contacts.json"), "w", encoding="utf-8") as f:
    json.dump(discovery_report, f, indent=2, ensure_ascii=False)

print(f"Phase 1 Complete!")
print(f"Total contacts: {len(contacts)}")
print(f"Total LID mappings: {len(lid_to_pn)}")
print(f"Target tech groups discovered: {len(target_groups)}")
for jid, tg in target_groups.items():
    print(f"  - {tg['name']} ({jid}): {tg['message_count']} msgs, {len(tg['participants'])} resolved senders")
