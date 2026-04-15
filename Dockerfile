# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY yevents/package*.json ./yevents/
RUN cd yevents && npm ci
COPY yevents/ ./yevents/
RUN cd yevents && npm run build

# --- Stage 2: Final Production Image ---
FROM node:20-slim

# System dependencies
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend source files
COPY ynov_events/package*.json ./
COPY ynov_events/prisma ./prisma/
COPY ynov_events/src ./src/

# Install dependencies and generate Prisma client IN THE FINAL IMAGE
RUN npm ci --omit=dev
RUN npx prisma generate

# Copy frontend dist
COPY --from=frontend-builder /app/yevents/dist ./public

# Verify
RUN echo "=== Checking structure ===" && \
    node -e "const { PrismaClient } = require('@prisma/client'); console.log('Prisma OK');" && \
    ls public/index.html && echo "Frontend OK"

ENV FRONTEND_PATH=/app/public
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "src/app.js"]
