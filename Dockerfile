# Production stage for Backend only
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy backend source
COPY backend/ ./backend/

# Expose port (Hugging Face expects 7860)
EXPOSE 7860

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7860

# Start the server
CMD ["node", "backend/index.js"]
