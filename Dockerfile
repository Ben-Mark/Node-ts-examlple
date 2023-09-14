# Use Node 18 as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Copy the source code to the working directory
COPY . .

# Typescript build
RUN npm run build

# Expose port 3000 (or whichever port your app runs on)
EXPOSE 3000

# Run the application using npm start
CMD [ "npm", "start" ]
