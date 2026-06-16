# --- STAGE 1: BUILD ---
FROM node:22.21-bookworm-slim AS builder
WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# --- STAGE 2: LIVE SERVER (DEPLOYMENT) ---
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# 1. Remove default nginx static assets
RUN rm -rf ./*

# 2. Copy the build output from the builder stage (Vite outputs to 'dist')
COPY --from=builder /app/dist .

# 3. Expose the port (Caddy proxies landing:80)
EXPOSE 80

# VITE_* env vars are read from Landing/.env at build time (stage 1) and baked into dist.
# Set VITE_DASH_URL (the dashboard's `dash.` subdomain) before building.

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
