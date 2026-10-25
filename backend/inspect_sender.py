import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
store_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"
conn_wa = sqlite3.connect(os.path.join(store_dir, "whatsapp.db"))
cur_wa = conn_wa.cursor()

sender = "83877188120594"
print(f"--- Checking LID / Phone for {sender} ---")
cur_wa.execute("SELECT * FROM whatsmeow_lid_map WHERE lid LIKE ? OR pn LIKE ?", (f"%{sender}%", f"%{sender}%"))
print("LID Map:", cur_wa.fetchall())

cur_wa.execute("SELECT their_jid, first_name, full_name, push_name, business_name FROM whatsmeow_contacts WHERE their_jid LIKE ?", (f"%{sender}%",))
print("Contacts by sender:", cur_wa.fetchall())

conn_msg = sqlite3.connect(os.path.join(store_dir, "messages.db"))
cur_msg = conn_msg.cursor()
cur_msg.execute("SELECT chat_jid, count(*) FROM messages WHERE sender LIKE ? GROUP BY chat_jid", (f"%{sender}%",))
print("Sender messages across all chats:", cur_msg.fetchall())

cur_msg.execute("SELECT id, chat_jid, content, timestamp, media_type FROM messages WHERE sender LIKE ? AND content != ''", (f"%{sender}%",))
print("\nAll text messages by this sender across all chats:")
for r in cur_msg.fetchall():
    print(r[0], r[1], r[3], r[4])
    print(r[2])
    print("-" * 40)
