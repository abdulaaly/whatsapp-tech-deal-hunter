import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect(r'C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store\messages.db')
cur = conn.cursor()

cur.execute("""
    SELECT id, sender, content, timestamp, media_type, filename 
    FROM messages 
    WHERE chat_jid = '120363291118991272@g.us'
    ORDER BY timestamp ASC
""")
rows = cur.fetchall()
print(f"Total rows in Al Raheem Mobile Mart: {len(rows)}")

text_rows = [r for r in rows if r[2] and r[2].strip()]
media_rows = [r for r in rows if r[4]]

print(f"Messages with text content: {len(text_rows)}")
print(f"Messages with media attachments: {len(media_rows)}")

for r in text_rows:
    print("=" * 60)
    print(f"ID: {r[0]} | Sender: {r[1]} | Time: {r[3]} | Media: {r[4]}")
    print(r[2])
