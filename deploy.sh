#!/usr/bin/env bash
# Run on your VPS to deploy/update family-calendar
set -e

APP_DIR=/var/www/family-calendar

echo "→ Pulling latest code..."
cd "$APP_DIR"
git pull origin main

echo "→ Installing dependencies..."
npm ci --production=false

echo "→ Building..."
npm run build

echo "→ Restarting PM2 process..."
pm2 reload ecosystem.config.js --env production

echo "✓ Done."
