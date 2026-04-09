import os
import json
import urllib.request
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        try:
            update = json.loads(body)
            message = update.get("message") or update.get("edited_message")
            if message:
                user = message.get("from", {})
                text = message.get("text", "")
                if text.startswith("/start"):
                    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
                    chat_id = message["chat"]["id"]
                    first_name = user.get("first_name", "")
                    reply = json.dumps({
                        "chat_id": chat_id,
                        "text": f"សួស្តី {first_name}!"
                    }).encode()
                    req = urllib.request.Request(
                        f"https://api.telegram.org/bot{token}/sendMessage",
                        data=reply,
                        headers={"Content-Type": "application/json"},
                        method="POST",
                    )
                    urllib.request.urlopen(req)
            self._respond(200, '{"ok":true}')
        except Exception as e:
            self._respond(500, json.dumps({"error": str(e)}))

    def do_GET(self):
        self._respond(200, '{"status":"webhook active"}')

    def _respond(self, status, body):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body.encode())

    def log_message(self, format, *args):
        pass
