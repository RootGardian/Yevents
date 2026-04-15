# --- Stage 1: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/yevents
COPY yevents/package*.json ./
RUN npm install
COPY yevents/ ./
RUN npm run build

# --- Stage 2: Prepare Backend ---
FROM node:20-slim AS backend-builder
WORKDIR /app/ynov_events
COPY ynov_events/package*.json ./
COPY ynov_events/prisma ./prisma/
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm install
COPY ynov_events/ ./
RUN npx prisma generate

# --- Stage 3: Final Production Image ---
FROM node:20-slim
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy backend (includes node_modules and prisma client)
COPY --from=backend-builder /app/ynov_events ./ynov_events

# Copy built frontend into a location the backend can reliably find
COPY --from=frontend-builder /app/yevents/dist ./ynov_events/public

# Set context to backend
WORKDIR /app/ynov_events

# Set frontend path explicitly
ENV FRONTEND_PATH=/app/ynov_events/public

# Expose port
EXPOSE 8080

# Start application
CMD ["node", "src/app.js"]
