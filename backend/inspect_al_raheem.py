import sqlite3
import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

store_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"
conn_msg = sqlite3.connect(os.path.join(store_dir, "messages.db"))
cur_msg = conn_msg.cursor()

# Find all messages from Al __ Raheem mobile mart
cur_msg.execute("""
    SELECT id, chat_jid, sender, content, timestamp, media_type, filename 
    FROM messages 
    WHERE chat_jid = '120363291118991272@g.us'
    ORDER BY timestamp ASC
""")
rows = cur_msg.fetchall()
print(f"Total messages in 'Al __ Raheem mobile mart ✅📱' (120363291118991272@g.us): {len(rows)}")

for i, r in enumerate(rows):
    print(f"\n--- [{i+1}] ID: {r[0]} | Sender: {r[2]} | Time: {r[4]} | Media: {r[5]} ---")
    if r[3]:
        print(r[3][:300] + ("..." if len(r[3]) > 300 else ""))

# Also check any other chats matching 'Raheem' or 'Rahim' or 'Market' or 'Mart'
print("\n=== ANY OTHER SIMILAR CHATS ===")
cur_msg.execute("SELECT jid, name, last_message_time FROM chats WHERE name LIKE '%raheem%' OR name LIKE '%rahim%' OR name LIKE '%mart%' OR name LIKE '%market%'")
for c in cur_msg.fetchall():
    print(c)
