import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
store_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"
conn = sqlite3.connect(os.path.join(store_dir, "messages.db"))
cur = conn.cursor()

# Check duplication by file_sha256
cur.execute("""
    SELECT hex(file_sha256) as sha, count(*) as cnt, group_concat(chat_jid, ' | ') as chats, group_concat(timestamp, ' | ') as times
    FROM messages
    WHERE file_sha256 IS NOT NULL
    GROUP BY file_sha256
    HAVING cnt > 1
    ORDER BY cnt DESC
""")
dup_media = cur.fetchall()
print(f"=== DUPLICATE MEDIA FILES (Identical SHA256 across messages/groups) ===")
print(f"Found {len(dup_media)} duplicate media SHA hashes")
for d in dup_media[:10]:
    print(f"SHA: {d[0][:16]}... | Seen {d[1]} times across chats:")
    for chat in d[2].split(' | '):
        print(f"   -> {chat}")

# Check all media files in Al Raheem group
cur.execute("""
    SELECT count(*), media_type FROM messages WHERE chat_jid = '120363291118991272@g.us' GROUP BY media_type
""")
print("\n=== AL RAHEEM GROUP MEDIA TYPES ===")
for r in cur.fetchall():
    print(r)

# Check all chats where 83877188120594 posted
cur.execute("""
    SELECT chat_jid, count(*) FROM messages WHERE sender = '83877188120594' GROUP BY chat_jid
""")
print("\n=== SENDER 83877188120594 (Muhammad Hamza / Al Raheem) POSTINGS ===")
for r in cur.fetchall():
    print(r)
