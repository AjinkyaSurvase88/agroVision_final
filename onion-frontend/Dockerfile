FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Build the app
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Install serve to run the build
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
