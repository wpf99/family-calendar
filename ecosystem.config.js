module.exports = {
  apps: [
    {
      name: "family-calendar",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/family-calendar",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "256M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
