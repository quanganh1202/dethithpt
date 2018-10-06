# Use Node v8.9.0 LTS
FROM ubuntu

# Setup app working directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get install libreoffice curl -y
RUN apt-get update && apt-get install graphicsmagick ghostscript -y

RUN apt-get install -y nodejs
# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy sourcecode
COPY . .
COPY resource/fonts /usr/share/fonts

COPY wait-for-it.sh /
RUN chmod 755 /wait-for-it.sh

# Start app
CMD /wait-for-it.sh mysql:3306 -- npm start
