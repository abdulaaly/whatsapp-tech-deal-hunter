#!/usr/bin/env python3
"""
WhatsApp Tech Deal Radar - Real-Time Live Sync Server
Connects directly to WhatsApp SQLite store (messages.db & whatsapp.db).
Exposes real-time REST and Sync endpoints for the Vite React Dashboard.
Supports on-demand sync, live message streaming, and automatic dataset refreshing.
"""

import http.server
import socketserver
import json
import os
import sqlite3
import sys
import urllib.parse
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

PORT = 8765
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
DASHBOARD_DATA_DIR = os.path.join(PROJECT_DIR, "dashboard", "src", "data")

DB_DIR = r"C:\Users\abdul\.gemini\antigravity-ide\scratch\gemini-ecosystem\whatsapp-mcp\whatsapp-bridge\store"
MSG_DB = os.path.join(DB_DIR, "messages.db")
WA_DB = os.path.join(DB_DIR, "whatsapp.db")

def get_db_stats():
    stats = {
        "connected": False,
        "msg_db_exists": os.path.exists(MSG_DB),
        "wa_db_exists": os.path.exists(WA_DB),
        "total_messages": 0,
        "total_chats": 0,
        "total_contacts": 0,
        "last_msg_timestamp": None,
        "db_last_modified": None
    }
    try:
        if os.path.exists(MSG_DB):
            stats["db_last_modified"] = datetime.fromtimestamp(os.path.getmtime(MSG_DB)).strftime('%Y-%m-%d %H:%M:%S')
            conn = sqlite3.connect(MSG_DB)
            cur = conn.cursor()
            stats["total_messages"] = cur.execute("SELECT count(*) FROM messages").fetchone()[0]
            stats["total_chats"] = cur.execute("SELECT count(*) FROM chats").fetchone()[0]
            last_msg = cur.execute("SELECT timestamp FROM messages ORDER BY timestamp DESC LIMIT 1").fetchone()
            if last_msg:
                stats["last_msg_timestamp"] = last_msg[0]
            conn.close()

        if os.path.exists(WA_DB):
            conn_wa = sqlite3.connect(WA_DB)
            cur_wa = conn_wa.cursor()
            stats["total_contacts"] = cur_wa.execute("SELECT count(*) FROM whatsmeow_contacts").fetchone()[0]
            conn_wa.close()

        stats["connected"] = True
    except Exception as e:
        stats["error"] = str(e)

    return stats

def get_raw_messages(limit=50):
    messages = []
    if not os.path.exists(MSG_DB) or not os.path.exists(WA_DB):
        return messages

    try:
        conn = sqlite3.connect(MSG_DB)
        cur = conn.cursor()
        conn_wa = sqlite3.connect(WA_DB)
        cur_wa = conn_wa.cursor()

        # Build contact phone mapping
        contact_map = {}
        for r in cur_wa.execute("SELECT their_jid, full_name, push_name, business_name FROM whatsmeow_contacts").fetchall():
            c_jid = r[0].split('@')[0]
            name = r[1] or r[2] or r[3]
            if name:
                contact_map[c_jid] = name

        lid_map = {}
        for r in cur_wa.execute("SELECT lid, pn FROM whatsmeow_lid_map").fetchall():
            lid_map[str(r[0])] = str(r[1])

        rows = cur.execute("""
            SELECT id, chat_jid, sender, content, timestamp, media_type, filename, is_from_me 
            FROM messages 
            WHERE length(content) > 0 
            ORDER BY timestamp DESC 
            LIMIT ?
        """, (limit,)).fetchall()

        for r in rows:
            sender_raw = r[2].split('@')[0]
            phone = lid_map.get(sender_raw, sender_raw)
            resolved_name = contact_map.get(phone, sender_raw)

            messages.append({
                "id": r[0],
                "chat_jid": r[1],
                "sender": sender_raw,
                "sender_phone": phone,
                "sender_name": resolved_name,
                "content": r[3],
                "timestamp": r[4],
                "media_type": r[5],
                "filename": r[6],
                "is_from_me": bool(r[7])
            })

        conn.close()
        conn_wa.close()
    except Exception as e:
        print(f"Error fetching raw messages: {e}")

    return messages

class LiveSyncHandler(http.server.BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type='application/json'):
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/status':
            stats = get_db_stats()
            self._set_headers(200)
            self.wfile.write(json.dumps(stats, indent=2).encode('utf-8'))

        elif path == '/api/messages':
            msgs = get_raw_messages(60)
            self._set_headers(200)
            self.wfile.write(json.dumps({"messages": msgs, "count": len(msgs)}, indent=2).encode('utf-8'))

        elif path == '/api/deals':
            deals_path = os.path.join(DASHBOARD_DATA_DIR, "enriched_rankings.json")
            if os.path.exists(deals_path):
                with open(deals_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                self._set_headers(200)
                self.wfile.write(json.dumps(data).encode('utf-8'))
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Deals dataset not found"}).encode('utf-8'))

        elif path == '/api/al-raheem/data':
            # Return live Al-Rahim group audit & Shopify store summary
            matrix_path = os.path.join(PROJECT_DIR, "exports", "al_raheem", "duplication_matrix.json")
            manifest_path = os.path.join(PROJECT_DIR, "exports", "al_raheem", "shopify_store_manifest.json")
            seller_path = os.path.join(PROJECT_DIR, "exports", "al_raheem", "seller_verification_profile.json")
            
            data = {"success": True}
            if os.path.exists(matrix_path):
                with open(matrix_path, "r", encoding="utf-8") as f:
                    data["duplication"] = json.load(f)
            if os.path.exists(manifest_path):
                with open(manifest_path, "r", encoding="utf-8") as f:
                    data["shopify_manifest"] = json.load(f)
            if os.path.exists(seller_path):
                with open(seller_path, "r", encoding="utf-8") as f:
                    data["seller_profile"] = json.load(f)

            self._set_headers(200)
            self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

        elif path == '/api/al-raheem/export':
            zip_path = os.path.join(PROJECT_DIR, "al_raheem_mobile_market_export.zip")
            if os.path.exists(zip_path):
                with open(zip_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/zip')
                self.send_header('Content-Disposition', 'attachment; filename="al_raheem_mobile_market_export.zip"')
                self.send_header('Content-Length', str(len(content)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content)
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Zip export not found"}).encode('utf-8'))

        elif path == '/api/al-raheem/shopify.csv':
            csv_path = os.path.join(PROJECT_DIR, "exports", "al_raheem", "shopify_products_import.csv")
            if os.path.exists(csv_path):
                with open(csv_path, 'r', encoding='utf-8') as f:
                    content = f.read().encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'text/csv; charset=utf-8')
                self.send_header('Content-Disposition', 'attachment; filename="shopify_products_import.csv"')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content)
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Shopify CSV not found"}).encode('utf-8'))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode('utf-8'))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/sync':
            # Execute full real dataset regeneration
            gen_script = os.path.join(BASE_DIR, "generate_real_cross_group_dataset.py")
            os.system(f'python "{gen_script}"')
            stats = get_db_stats()

            deals_path = os.path.join(DASHBOARD_DATA_DIR, "enriched_rankings.json")
            deal_count = 0
            if os.path.exists(deals_path):
                with open(deals_path, 'r', encoding='utf-8') as f:
                    deals = json.load(f)
                    deal_count = len(deals)

            response = {
                "success": True,
                "synced_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "total_deals": deal_count,
                "db_stats": stats,
                "message": "Real-time sync completed successfully from WhatsApp SQLite store"
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode('utf-8'))

def run_server():
    print(f"[LiveSync] Starting WhatsApp Real-Time Sync Server on port {PORT}...")
    print(f"[LiveSync] Database target: {MSG_DB}")
    with socketserver.TCPServer(("", PORT), LiveSyncHandler) as httpd:
        print(f"[LiveSync] Serving HTTP on 0.0.0.0:{PORT} (Press Ctrl+C to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[LiveSync] Stopping server...")
            httpd.shutdown()

if __name__ == '__main__':
    run_server()
