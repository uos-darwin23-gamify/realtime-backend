module.exports = {
  apps: [
    {
      name: "realtime-backend",
      script: "./build/server.js",
      env_production: {
        NODE_ENV: "production",
        RAILS_SERVER_URL_DEV: "http://localhost:3000/socket",
        RAILS_SERVER_URL_PRODUCTION: "https://gamifycoding.me/socket",
      },
    },
  ],
};
