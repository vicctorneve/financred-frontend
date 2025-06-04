FROM node:18

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN rm -rf node_modules && pnpm store prune && pnpm cache clean

RUN pnpm install

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev"]
