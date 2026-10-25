import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"
msg_db = os.path.join(db_dir, "messages.db")
wa_db = os.path.join(db_dir, "whatsapp.db")

print("================= messages.db =================")
if os.path.exists(msg_db):
    conn = sqlite3.connect(msg_db)
    cur = conn.cursor()
    tables = cur.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
    for t in tables:
        t_name = t[0]
        cnt = cur.execute(f"SELECT count(*) FROM {t_name}").fetchone()[0]
        print(f"Table: {t_name} | count: {cnt}")
        cols = [c[1] for c in cur.execute(f"PRAGMA table_info({t_name})").fetchall()]
        print(f"   Columns: {cols}")
        if cnt > 0:
            sample = cur.execute(f"SELECT * FROM {t_name} LIMIT 3").fetchall()
            for s in sample:
                print(f"   Sample: {str(s)[:200]}")

print("\n================= whatsapp.db =================")
if os.path.exists(wa_db):
    conn2 = sqlite3.connect(wa_db)
    cur2 = conn2.cursor()
    tables2 = cur2.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
    for t in tables2:
        t_name = t[0]
        cnt = cur2.execute(f"SELECT count(*) FROM {t_name}").fetchone()[0]
        print(f"Table: {t_name} | count: {cnt}")
        cols = [c[1] for c in cur2.execute(f"PRAGMA table_info({t_name})").fetchall()]
        print(f"   Columns: {cols}")
        if cnt > 0 and t_name in ['whatsmeow_chat_settings', 'whatsmeow_contacts', 'whatsmeow_groups']:
            sample = cur2.execute(f"SELECT * FROM {t_name} LIMIT 3").fetchall()
            for s in sample:
                print(f"   Sample: {str(s)[:200]}")
