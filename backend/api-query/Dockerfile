# Use Node v8.9.0 LTS
FROM node:carbon

# Setup app working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy sourcecode
COPY . .
COPY wait-for-it.sh /
RUN chmod 755 /wait-for-it.sh
# Start app
CMD /wait-for-it.sh rabbitmq:5672 -- npm start