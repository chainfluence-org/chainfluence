# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the Next.js app package.json and yarn.lock files
COPY packages/nextjs/package*.json packages/nextjs/yarn.lock* ./

# Install Next.js app dependencies
RUN yarn install --frozen-lockfile

# Bundle the app source
COPY packages/nextjs ./

# Build the app
RUN yarn build

# Your app runs on port 3000. Expose it!
EXPOSE 3000

# Define the command to run the app
CMD [ "yarn", "start" ]
