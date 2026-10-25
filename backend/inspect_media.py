import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
store_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"
conn = sqlite3.connect(os.path.join(store_dir, "messages.db"))
cur = conn.cursor()

cur.execute("""
    SELECT id, sender, timestamp, media_type, filename, url, file_length, 
           case when media_key is not null then 1 else 0 end as has_key,
           case when file_sha256 is not null then 1 else 0 end as has_sha
    FROM messages 
    WHERE chat_jid = '120363291118991272@g.us'
    ORDER BY timestamp ASC
""")
rows = cur.fetchall()
print(f"Total messages in Al Raheem group: {len(rows)}")
for r in rows[:25]:
    print(r)
