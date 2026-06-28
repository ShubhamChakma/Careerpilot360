# Use Node.js LTS Alpine image for a lightweight production container
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package definitions
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the server files
COPY . .

# Expose backend API port
EXPOSE 5000

# Set environment production flag
ENV NODE_ENV=production

# Run start script
CMD ["npm", "start"]
