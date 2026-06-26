FROM node:22-alpine

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY shared/package.json shared/package.json
COPY backend/package.json backend/package.json

RUN pnpm install --filter backend... --no-frozen-lockfile

COPY shared shared
COPY backend backend

RUN pnpm --filter @wellness/shared build
RUN pnpm --filter backend prisma:generate

WORKDIR /app/backend

EXPOSE 3001
