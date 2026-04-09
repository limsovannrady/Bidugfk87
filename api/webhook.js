const https = require("https");

function sendMessage(token, chatId, text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ chat_id: chatId, text });
    const options = {
      hostname: "api.telegram.org",
      path: `/bot${token}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      res.on("data", () => {});
      res.on("end", resolve);
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const update = req.body || {};
      const message = update.message || update.edited_message;
      if (message) {
        const user = message.from || {};
        const text = message.text || "";
        if (text.startsWith("/start")) {
          const token = process.env.TELEGRAM_BOT_TOKEN;
          const chatId = message.chat.id;
          const firstName = user.first_name || "";
          await sendMessage(token, chatId, `សួស្តី ${firstName}!`);
        }
      }
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    res.status(200).json({ status: "webhook active" });
  }
};
