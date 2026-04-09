# Telegram Bot Dashboard Project

## Overview

A Telegram Bot with a web dashboard to view and manage users. Built with Python (bot + API) and React (dashboard).

## Stack

- **Bot**: Python + python-telegram-bot
- **API (Replit)**: Python Flask on port 5001
- **API (Vercel)**: Python serverless functions in `api/`
- **Database**: PostgreSQL (stores bot users)
- **Dashboard**: React + Vite + Tailwind CSS
- **Package manager**: pnpm workspace

## Project Structure

```
├── bot.py                    # Telegram bot (polling mode — for Replit)
├── api.py                    # Flask API (for Replit local dev)
├── api/                      # Vercel serverless functions
│   ├── users.py              # GET /api/users
│   ├── stats.py              # GET /api/stats
│   ├── webhook.py            # POST /api/webhook (Telegram webhook)
│   └── requirements.txt      # Python deps for Vercel
├── setup_webhook.py          # Script to register Telegram webhook
├── vercel.json               # Vercel deployment config
├── artifacts/
│   └── bot-dashboard/        # React dashboard (Vite)
│       └── src/
│           ├── App.tsx
│           ├── index.css
│           └── pages/
│               └── Dashboard.tsx
├── pnpm-workspace.yaml       # pnpm workspace config
├── tsconfig.base.json        # Base TypeScript config
└── pyproject.toml            # Python dependencies (Replit)
```

## Workflows (Replit local dev)

- **Telegram Bot**: `python3 bot.py` — polls Telegram, saves new users to PostgreSQL
- **Flask API**: `python3 api.py` on port 5001 — serves user data via REST API
- **artifacts/bot-dashboard: web**: React dashboard (dev server)

## Database

PostgreSQL table `bot_users`:
- `id` (serial PK)
- `user_id` (bigint, unique) — Telegram user ID
- `username` (varchar) — Telegram @username
- `first_name` (varchar)
- `last_name` (varchar)
- `joined_at` (timestamp)

## API Endpoints

- `GET /api/users` — list all bot users
- `GET /api/stats` — `{ total, today }` stats
- `POST /api/webhook` — Telegram webhook receiver

## Deploying to Vercel

### Step 1: Set up a public PostgreSQL database

Use one of: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app).
Get your `DATABASE_URL` connection string.

Create the `bot_users` table:
```sql
CREATE TABLE IF NOT EXISTS bot_users (
    id SERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    joined_at TIMESTAMP DEFAULT NOW()
);
```

### Step 2: Deploy to Vercel

1. Push this repo to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `TELEGRAM_BOT_TOKEN` — your bot token

### Step 3: Register Telegram webhook

After deploying, run once:
```bash
python3 setup_webhook.py https://your-project.vercel.app
```

This registers the Vercel URL as your bot's webhook (replaces polling).
