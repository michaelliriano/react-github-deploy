# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code to the working directory
COPY . .

RUN npm run build

# Expose the port the app runs on
EXPOSE $PORT

# Start the application
CMD ["npm", "run","start"]
