import sqlite3
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
store_dir = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"
conn_msg = sqlite3.connect(os.path.join(store_dir, "messages.db"))
cur_msg = conn_msg.cursor()

cur_msg.execute("""
    SELECT timestamp, media_type, filename, content, hex(file_sha256), file_length
    FROM messages
    WHERE chat_jid = '120363291118991272@g.us'
    ORDER BY timestamp ASC
""")
rows = cur_msg.fetchall()

# Group by time clusters (within 1 minute of each other)
clusters = []
current_cluster = []
import datetime

def parse_time(ts_str):
    # '2026-10-22 11:07:22 +0500 PKT'
    parts = ts_str.split(' +')[0]
    return datetime.datetime.strptime(parts, "%Y-%m-%d %H:%M:%S")

for r in rows:
    t = parse_time(r[0])
    if not current_cluster:
        current_cluster.append((t, r))
    else:
        prev_t = current_cluster[-1][0]
        if (t - prev_t).total_seconds() <= 120:
            current_cluster.append((t, r))
        else:
            clusters.append(current_cluster)
            current_cluster = [(t, r)]
if current_cluster:
    clusters.append(current_cluster)

print(f"Total message bursts/clusters in Al Raheem: {len(clusters)}")
for idx, c in enumerate(clusters):
    start_t = c[0][0].strftime("%H:%M:%S")
    end_t = c[-1][0].strftime("%H:%M:%S")
    print(f"\n--- Burst {idx+1}: {start_t} to {end_t} ({len(c)} items) ---")
    for item in c:
        r = item[1]
        txt = (r[3][:60] + "...") if r[3] else ""
        sha = r[4][:8] if r[4] else "NO_SHA"
        print(f"   [{r[0]}] {r[1]:<6} | {r[2]} | SHA:{sha} | {r[5]} bytes | {txt}")
