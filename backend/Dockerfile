# --- Build Stage ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Run the NestJS build script
RUN npm run build

# --- Production Stage ---
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Only copy the essential package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the built artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
