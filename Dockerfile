FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN curl https://install.meteor.com/ | sh
ENV PATH="/root/.meteor:$PATH"

COPY package*.json ./
RUN npm ci

COPY . .

ENV METEOR_ALLOW_SUPERUSER=1
RUN meteor build --directory /app/build

WORKDIR /app/build/bundle/programs/server
RUN npm install --production

WORKDIR /app/build/bundle

ENV NODE_ENV=production

EXPOSE 3000

CMD PORT=${PORT:-3000} node main.js
