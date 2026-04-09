import os
import psycopg2
import psycopg2.extras
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

@app.route("/api/users")
def get_users():
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT user_id, username, first_name, last_name, joined_at FROM bot_users ORDER BY joined_at DESC")
        users = cur.fetchall()
        return jsonify([dict(u) for u in users])
    finally:
        conn.close()

@app.route("/api/stats")
def get_stats():
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT COUNT(*) as total FROM bot_users")
        total = cur.fetchone()["total"]
        cur.execute("SELECT COUNT(*) as today FROM bot_users WHERE joined_at >= CURRENT_DATE")
        today = cur.fetchone()["today"]
        return jsonify({"total": total, "today": today})
    finally:
        conn.close()

@app.route("/api/healthz")
def healthz():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    port = int(os.environ.get("API_PORT", 5001))
    app.run(host="0.0.0.0", port=port)
