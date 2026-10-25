import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect(r'C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store\messages.db')
cur = conn.cursor()

cur.execute("""
    SELECT c.name, m.chat_jid, m.sender, m.content, m.timestamp, m.media_type, m.filename 
    FROM messages m
    JOIN chats c ON m.chat_jid = c.jid
    WHERE m.content IS NOT NULL AND m.content != ''
    ORDER BY m.timestamp ASC
""")
rows = cur.fetchall()
print(f"Total non-empty text messages across all chats: {len(rows)}")

for i, r in enumerate(rows):
    print("=" * 60)
    print(f"[{i+1}] CHAT: {r[0]} ({r[1]}) | SENDER: {r[2]} | TIME: {r[4]}")
    print(r[3])
