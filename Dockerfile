# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install serve to run the built app
RUN npm install -g serve

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Run the app
CMD ["serve", "-s", "dist", "-l", "3000"]