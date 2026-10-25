import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

store_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"

print("--- CHATS in messages.db ---")
conn_msg = sqlite3.connect(os.path.join(store_dir, "messages.db"))
cur_msg = conn_msg.cursor()
cur_msg.execute("SELECT * FROM chats")
chats = cur_msg.fetchall()
col_names = [d[0] for d in cur_msg.description]
print("Columns:", col_names)
for c in chats:
    print(c)

print("\n--- SEARCHING FOR 'Rahim' / 'Al-Rahim' / 'Mobile Market' / 'Aapka' in messages.db ---")
cur_msg.execute("SELECT jid, text, sender, timestamp FROM messages WHERE text LIKE '%rahim%' OR text LIKE '%market%' OR text LIKE '%aapka%' OR text LIKE '%mobile%'")
rows = cur_msg.fetchall()
print(f"Found {len(rows)} matching messages in messages.db")
for r in rows[:10]:
    print("Match:", r[0], r[2], r[3], (r[1][:80] if r[1] else ""))

print("\n--- SEARCHING FOR 'Rahim' / 'Al-Rahim' / 'Mobile Market' in whatsapp.db (whatsmeow_contacts) ---")
conn_wa = sqlite3.connect(os.path.join(store_dir, "whatsapp.db"))
cur_wa = conn_wa.cursor()
cur_wa.execute("SELECT their_jid, first_name, full_name, push_name, business_name FROM whatsmeow_contacts WHERE full_name LIKE '%rahim%' OR push_name LIKE '%rahim%' OR business_name LIKE '%rahim%' OR full_name LIKE '%market%' OR push_name LIKE '%market%' OR business_name LIKE '%market%' OR full_name LIKE '%mobile%' OR push_name LIKE '%mobile%' OR business_name LIKE '%mobile%' OR full_name LIKE '%aapka%' OR push_name LIKE '%aapka%'")
contacts = cur_wa.fetchall()
print(f"Found {len(contacts)} matching contacts/groups in whatsmeow_contacts")
for c in contacts:
    print("Contact/Group:", c)
