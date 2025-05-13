# ===============================================
# Base Stage: Common setup for all stages
# ===============================================
FROM node:20-alpine AS base

# Install pnpm globally as root
USER root
RUN apk add --no-cache jq
RUN npm install -g pnpm

# Create a non-root user and group if they don't already exist
RUN addgroup -S appgroup || true && \
    adduser -S appuser -G appgroup || true

# Set the working directory and fix ownership
WORKDIR /app
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# ===============================================
# Stage 1: Build the application
# ===============================================
FROM base AS builder

# Copy dependency files first to leverage Docker layer caching
COPY --chown=appuser:appgroup package.json pnpm-lock.yaml* ./

# Install dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY --chown=appuser:appgroup . .

# Build the application (assumes NestJS is configured to output to /dist)
RUN pnpm run build

# ===============================================
# Stage 2: Create the production image
# ===============================================
FROM base AS production

# Copy only production dependencies from the builder stage
COPY --from=builder --chown=appuser:appgroup /app/package.json /app/pnpm-lock.yaml ./
RUN jq 'del(.scripts.prepare)' package.json > package.tmp.json && \
    mv package.tmp.json package.json && \
    pnpm install --prod --frozen-lockfile

# Copy the built application from the builder stage
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE $PORT

# Health check to ensure the application is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Start the application
CMD ["node", "dist/main.js"]

# ===============================================
# Stage 3: Development stage
# ===============================================
FROM base AS development

# Copy dependency files
COPY --chown=appuser:appgroup package.json pnpm-lock.yaml* ./

# Install all dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY --chown=appuser:appgroup . .

# Expose the application port
EXPOSE $PORT

# Set environment variables for development
ENV NODE_ENV=development
ENV PORT=3000

# Start the application in development mode
CMD ["pnpm", "run", "start:dev"]
