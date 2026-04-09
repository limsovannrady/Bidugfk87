# Telegram Bot Dashboard Project

## Overview

A Telegram Bot with a web dashboard to view and manage users. Built with Python (bot + API) and React (dashboard).

## Stack

- **Bot**: Python + python-telegram-bot
- **API**: Python Flask (REST API serving user data)
- **Database**: PostgreSQL (stores bot users)
- **Dashboard**: React + Vite + Tailwind CSS
- **Package manager**: pnpm workspace

## Project Structure

```
├── bot.py                    # Telegram bot (saves users on /start)
├── api.py                    # Flask REST API for dashboard data
├── artifacts/
│   └── bot-dashboard/        # React dashboard (Vite)
│       └── src/
│           ├── App.tsx
│           ├── index.css
│           └── pages/
│               └── Dashboard.tsx
├── pnpm-workspace.yaml       # pnpm workspace config
├── tsconfig.base.json        # Base TypeScript config
└── pyproject.toml            # Python dependencies
```

## Workflows

- **Telegram Bot**: Runs `python3 bot.py` — polls Telegram, saves new users to PostgreSQL
- **Flask API**: Runs `python3 api.py` on port 5001 — serves user data via REST API
- **artifacts/bot-dashboard: web**: React dashboard on port assigned by platform

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
- `GET /api/healthz` — health check

## How It Works

1. User sends `/start` to the Telegram bot
2. Bot saves user info to PostgreSQL
3. Dashboard fetches from Flask API via Vite proxy (`/api` → localhost:5001)
4. Dashboard shows user list with search and stats
