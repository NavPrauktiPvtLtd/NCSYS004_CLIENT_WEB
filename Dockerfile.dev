# Stage 1: Build the client
FROM node:20.10.0-alpine AS client-build

# ENV NODE_ENV=development

WORKDIR /app

# Copy client package files and install dependencies
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy the client source code and build it
COPY client/ ./client/
RUN cd client && npm run build

# Stage 2: Build the server
FROM node:20.10.0-alpine AS server-build

WORKDIR /app

# Copy server package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the server source code
COPY . ./

# Copy the built client files from the previous stage
COPY --from=client-build /app/client/dist ./client/dist

# Expose the desired port
EXPOSE 5050

# Start the server
# CMD ["node", "index.js"]
