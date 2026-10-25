import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"
msg_db = os.path.join(db_dir, "messages.db")
wa_db = os.path.join(db_dir, "whatsapp.db")

conn = sqlite3.connect(msg_db)
cur = conn.cursor()

conn_wa = sqlite3.connect(wa_db)
cur_wa = conn_wa.cursor()

# build lid map
lid_map = {}
for r in cur_wa.execute("SELECT lid, pn FROM whatsmeow_lid_map").fetchall():
    lid_map[str(r[0])] = str(r[1])

# build contact map
contact_map = {}
for r in cur_wa.execute("SELECT their_jid, full_name, push_name, business_name FROM whatsmeow_contacts").fetchall():
    c_jid = r[0].split('@')[0]
    name = r[1] or r[2] or r[3]
    if name:
        contact_map[c_jid] = name

chats = cur.execute('SELECT jid, name, last_message_time FROM chats').fetchall()
print(f"Total chats in messages.db: {len(chats)}\n")
for c in chats:
    cnt = cur.execute('SELECT count(*) FROM messages WHERE chat_jid=?', (c[0],)).fetchone()[0]
    is_group = "@g.us" in c[0]
    resolved_name = c[1]
    sender_clean = c[0].split('@')[0]
    if sender_clean in lid_map:
        sender_clean = lid_map[sender_clean]
    if sender_clean in contact_map:
        resolved_name = f"{resolved_name} ({contact_map[sender_clean]})"
    print(f"Chat: {c[0]} | Name: {resolved_name} | Type: {'Group' if is_group else 'DM'} | Msgs: {cnt}")

print("\n================ Messages Preview ================")
msgs = cur.execute('SELECT id, chat_jid, sender, content, timestamp, media_type, filename FROM messages').fetchall()
print(f"Total messages in db: {len(msgs)}")
content_msgs = [m for m in msgs if m[3] and m[3].strip()]
print(f"Messages with text content: {len(content_msgs)}")

for idx, m in enumerate(content_msgs):
    s_raw = m[2].split('@')[0]
    s_phone = lid_map.get(s_raw, s_raw)
    s_name = contact_map.get(s_phone, s_phone)
    print(f"\n--- [#{idx+1}] ID: {m[0]} | Chat: {m[1]} | From: {s_name} ({s_phone}) | Time: {m[4]} ---")
    print(m[3][:300])
