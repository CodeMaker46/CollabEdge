# Use official Node.js Alpine image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Optional: copy environment file if needed for build/runtime
# (Uncomment only if you're including .env in Docker image)
# COPY .env .env

# Expose backend port (e.g., 3000)
EXPOSE 3000

# Start the app (adjust if you're using another entry point)
CMD ["npm", "run", "dev"]
