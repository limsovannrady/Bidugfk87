import os
import json
import psycopg2
import psycopg2.extras
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(
                "SELECT user_id, username, first_name, last_name, joined_at "
                "FROM bot_users ORDER BY joined_at DESC"
            )
            users = cur.fetchall()
            conn.close()
            data = json.dumps([dict(u) for u in users], default=str)
            self._respond(200, data)
        except Exception as e:
            self._respond(500, json.dumps({"error": str(e)}))

    def do_OPTIONS(self):
        self._respond(200, "")

    def _respond(self, status, body):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.end_headers()
        self.wfile.write(body.encode())

    def log_message(self, format, *args):
        pass
