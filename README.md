# Family Calendar

A print-ready weekly family calendar that pulls events from Google Calendar.
Color-code each family member's calendar and print a beautiful weekly overview.

## Features

- Google OAuth sign-in — read-only calendar access
- Multiple calendars — one color per person / calendar
- Weekly navigation with today highlight
- One-click **Print** button (landscape, color-accurate)
- Configure display names and colors per calendar

## Local Development

1. Copy env file and fill in credentials:
   ```
   cp .env.example .env.local
   ```
2. Create a Google Cloud project → enable **Google Calendar API** → create an OAuth 2.0 client (Web application) → add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
3. Install and run:
   ```
   npm install
   npm run dev
   ```

## VPS Deployment

### First deploy
```bash
# On your VPS
sudo mkdir -p /var/www/family-calendar
sudo chown $USER:$USER /var/www/family-calendar
git clone https://github.com/YOUR_USER/family-calendar /var/www/family-calendar
cd /var/www/family-calendar
cp .env.example .env.local   # fill in production values
npm ci
npm run build
pm2 start ecosystem.config.js --env production
pm2 save
```

### Nginx
Copy `nginx.conf.example` to `/etc/nginx/sites-available/family-calendar`, update the domain, enable it, and reload nginx.

### Updates
```bash
bash /var/www/family-calendar/deploy.sh
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | OAuth 2.0 client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 client secret |
| `NEXTAUTH_SECRET` | Random secret — `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Full URL of your deployment (e.g. `https://calendar.yourdomain.com`) |
