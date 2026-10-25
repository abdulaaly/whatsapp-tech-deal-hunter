import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
store_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"

def search_text_in_db(db_path, terms):
    print(f"=== Searching in {os.path.basename(db_path)} ===")
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [r[0] for r in cur.fetchall()]
    for t in tables:
        cur.execute(f'PRAGMA table_info("{t}")')
        cols = [c[1] for c in cur.fetchall() if c[2] in ('TEXT', 'VARCHAR', '')]
        for c in cols:
            for term in terms:
                try:
                    cur.execute(f'SELECT "{c}" FROM "{t}" WHERE LOWER("{c}") LIKE ? LIMIT 5', (f"%{term.lower()}%",))
                    hits = cur.fetchall()
                    if hits:
                        print(f"  [HIT] Table '{t}', Col '{c}', Term '{term}': {len(hits)} hits")
                        for h in hits:
                            print(f"    -> {str(h[0])[:120]}")
                except Exception as e:
                    pass

search_text_in_db(os.path.join(store_dir, "messages.db"), ["alag", "aapka", "raheem", "rahim", "market"])
search_text_in_db(os.path.join(store_dir, "whatsapp.db"), ["alag", "aapka", "raheem", "rahim", "market"])
