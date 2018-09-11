# Use Node v8.9.0 LTS
FROM node:carbon

# Setup app working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install babel-cli -g --save
RUN npm install --only=production --no-optional

# Copy sourcecode
COPY . .

# Start app
CMD [ "npm", "start" ]