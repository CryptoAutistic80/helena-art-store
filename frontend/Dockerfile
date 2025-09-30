# Frontend Dockerfile for Helena Art Store

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.base.json ./
COPY nx.json ./

# Copy workspace configuration and libs
COPY libs ./libs
COPY frontend ./frontend

# Install dependencies
RUN npm ci --legacy-peer-deps

# Build the frontend
RUN npx nx build frontend --configuration=production

# Stage 2: Serve with nginx
FROM nginx:alpine AS runner

# Copy built application
COPY --from=builder /app/dist/frontend /usr/share/nginx/html

# Copy custom nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose the frontend port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

