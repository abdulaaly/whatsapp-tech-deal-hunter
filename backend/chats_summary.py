import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
store_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"
conn = sqlite3.connect(os.path.join(store_dir, "messages.db"))
cur = conn.cursor()

cur.execute("""
    SELECT c.jid, c.name, count(m.id) as msg_count, 
           sum(case when m.content != '' and m.content is not null then 1 else 0 end) as text_count,
           sum(case when m.media_type != '' and m.media_type is not null then 1 else 0 end) as media_count,
           c.last_message_time
    FROM chats c
    LEFT JOIN messages m ON c.jid = m.chat_jid
    GROUP BY c.jid
    ORDER BY msg_count DESC
""")
print(f"{'JID':<30} | {'NAME':<35} | {'MSGS':<5} | {'TEXT':<5} | {'MEDIA':<5} | LAST TIME")
print("-" * 115)
for r in cur.fetchall():
    print(f"{r[0]:<30} | {str(r[1])[:35]:<35} | {r[2]:<5} | {r[3]:<5} | {r[4]:<5} | {r[5]}")
