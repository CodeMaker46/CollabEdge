# -------------------------
# Stage 1: Build the app
# -------------------------
    FROM node:23-alpine AS builder

    WORKDIR /app
    
    # Install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy the rest of the app code including env file (if needed)
    COPY . .
    
    # Optional: If using Vite .env variables at build time
    COPY .env .env
    
    # Build the app
    RUN npm run build
    
    # -------------------------
    # Stage 2: Serve the app
    # -------------------------
    FROM node:23-alpine AS runner
    
    WORKDIR /app
    
    # Install serve globally
    RUN npm install -g serve
    
    # Copy only what's needed to run
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/node_modules ./node_modules
    
    # Expose desired port (change to 5173 if testing locally)
    EXPOSE 5173
    
    # Start static server
    CMD ["serve", "-s", "dist", "-l", "5173"]
    