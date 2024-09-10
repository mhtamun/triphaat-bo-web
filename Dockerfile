# Use an official Node.js image as the base
FROM node:18.20.4

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Start the application
CMD ["yarn", "start:prod"]
