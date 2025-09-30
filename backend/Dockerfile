# Backend Dockerfile for Helena Art Store

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.base.json ./
COPY nx.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./

# Copy workspace configuration and libs
COPY libs ./libs
COPY backend ./backend

# Install dependencies
RUN npm ci --legacy-peer-deps

# Build the backend
RUN npx nx build backend --configuration=production

# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy the built application
COPY --from=builder /app/dist/backend ./

# Install production dependencies using npm install
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Expose the backend port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "main.js"]

