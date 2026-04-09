export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const update = req.body;
      const message = update.message || update.edited_message;
      if (message) {
        const user = message.from || {};
        const text = message.text || "";
        if (text.startsWith("/start")) {
          const token = process.env.TELEGRAM_BOT_TOKEN;
          const chatId = message.chat.id;
          const firstName = user.first_name || "";
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: `សួស្តី ${firstName}!` }),
          });
        }
      }
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    res.status(200).json({ status: "webhook active" });
  }
}
