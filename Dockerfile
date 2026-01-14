# Build Stage for Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies for building
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY frontend/ ./frontend/
# Copy necessary root files for build
COPY tsconfig*.json ./

# Build frontend
RUN cd frontend && npm run build

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from builder
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (Hugging Face expects 7860)
EXPOSE 7860

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7860

# Start the server
CMD ["node", "backend/index.js"]
