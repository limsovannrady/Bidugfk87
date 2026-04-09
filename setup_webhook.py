"""
Run this script once after deploying to Vercel to register the webhook.
Usage: python3 setup_webhook.py <your-vercel-url>
Example: python3 setup_webhook.py https://my-bot-dashboard.vercel.app
"""
import os
import sys
import urllib.request
import json

TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
if not TOKEN:
    print("Error: TELEGRAM_BOT_TOKEN environment variable not set")
    sys.exit(1)

if len(sys.argv) < 2:
    print("Usage: python3 setup_webhook.py <your-vercel-url>")
    print("Example: python3 setup_webhook.py https://my-bot.vercel.app")
    sys.exit(1)

vercel_url = sys.argv[1].rstrip("/")
webhook_url = f"{vercel_url}/api/webhook"

payload = json.dumps({"url": webhook_url}).encode()
req = urllib.request.Request(
    f"https://api.telegram.org/bot{TOKEN}/setWebhook",
    data=payload,
    headers={"Content-Type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(req) as response:
    result = json.loads(response.read())
    if result.get("ok"):
        print(f"Webhook set successfully: {webhook_url}")
    else:
        print(f"Failed: {result}")
