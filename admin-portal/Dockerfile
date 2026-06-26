FROM node:22-alpine

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY shared/package.json shared/package.json
COPY admin-portal/package.json admin-portal/package.json

RUN pnpm install --filter admin-portal... --no-frozen-lockfile

COPY shared shared
COPY admin-portal admin-portal

RUN pnpm --filter @wellness/shared build

WORKDIR /app/admin-portal

EXPOSE 3000
