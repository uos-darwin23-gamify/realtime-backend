module.exports = {
  apps: [
    {
      name: "realtime-backend",
      script: "./build/server.js",
      env_production: {
        NODE_ENV: "production",
        RAILS_SERVER_URL_DEV: "http://localhost:3000/api/socket-server",
        RAILS_SERVER_URL_PRODUCTION:
          "https://gamifycoding.me/api/socket-server",
        SOCKET_SERVER_API_KEY:
          "a4bafb44b1f8deba075d42341204f092fd757443c6b4febc25c7e21574a287960840a9f7b317f1ffb31a189a032c5e677269bdad7b351fa57d7ad1854ca48c29",
      },
    },
  ],
};
