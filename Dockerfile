# syntax = docker/dockerfile:1

FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install -g typescript pm2

RUN yarn install

RUN yarn build

ENV PORT=4000

EXPOSE 4000
CMD ["yarn", "start"]