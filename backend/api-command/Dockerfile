# Use Node v8.9.0 LTS
FROM node:alpine

# Setup app working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy sourcecode
COPY . .
COPY resource/fonts /usr/share/fonts

COPY wait-for-it.sh /
RUN chmod 755 /wait-for-it.sh
RUN apt-get update && apt-get -y -q install libreoffice libreoffice-writer ure libreoffice-core libreoffice-common fonts-opensymbol hyphen-fr hyphen-de hyphen-en-us hyphen-it hyphen-ru fonts-dejavu fonts-dejavu-core fonts-dejavu-extra fonts-noto fonts-dustin fonts-f500 fonts-fanwood fonts-freefont-ttf fonts-liberation fonts-lmodern fonts-lyx fonts-sil-gentium fonts-texgyre fonts-tlwg-purisa && apt-get -q -y remove libreoffice-gnome
RUN apt-get update && apt-get install graphicsmagick ghostscript -y
# Start app
CMD /wait-for-it.sh mysql:3306 -- npm start
