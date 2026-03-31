FROM node:20-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json tsconfig.base.json ./
COPY packages/next-react ./packages/next-react

RUN pnpm install --filter next-react... --frozen-lockfile

WORKDIR /app/packages/next-react

RUN pnpm build \
  && cp -r public .next/standalone/packages/next-react/ \
  && cp -r .next/static .next/standalone/packages/next-react/.next/

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV I_WRITE_CODE_ACTIVITY_FILE=/app/data/i-write-code-activity.json

COPY --from=builder /app/packages/next-react/.next/standalone ./
COPY --from=builder /app/packages/next-react/data ./data

EXPOSE 3000

CMD ["node", "packages/next-react/server.js"]
