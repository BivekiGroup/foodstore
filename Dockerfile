# Multi-stage Dockerfile for Next.js (Node 20)
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3018

# Install system deps required by some Node binaries on Alpine
RUN apk add --no-cache libc6-compat

# Install dependencies (including dev for build)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production runner with only production deps
FROM base AS runner
WORKDIR /app

# Install only production dependencies for smaller image
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3018
CMD ["npm", "start"]

