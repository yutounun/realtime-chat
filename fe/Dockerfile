# Use the official Node.js 18 image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3002
EXPOSE 3002

# Command to start the app with Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3002"]
