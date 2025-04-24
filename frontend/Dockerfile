# Use official Node.js image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Build the Next.js app
RUN npm run build

# Run the app in production mode
CMD ["npm", "start"]
