# Use Node v8.9.0 LTS
FROM node:carbon

# Setup app working directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get install graphicsmagick ghostscript -y

RUN useradd -m libreoffice; \
    apt-get update \
    && apt-get install -y --no-install-recommends wget \
                                                  libdbus-glib-1-2 \
                                                  libsm6 \
                                                  openjdk-7-jre \
    && rm -rf /var/lib/apt/lists/*

ENV LIBREOFFICEPACKAGE LibreOffice_6.1.2_Linux_x86-64_deb.tar.gz
ENV LIBREOFFICEDIR LibreOffice_6.1.2.1_Linux_x86-64_deb

RUN wget -q https://ftp.gwdg.de/pub/tdf/libreoffice/stable/6.1.2/deb/x86_64/$LIBREOFFICEPACKAGE -O /tmp/$LIBREOFFICEPACKAGE \
    && mkdir /tmp/LibreOffice \
    && tar -xzf /tmp/$LIBREOFFICEPACKAGE -C /tmp/LibreOffice \
    && dpkg -i /tmp/LibreOffice/$LIBREOFFICEDIR/DEBS/*.deb \
    && rm -f /tmp/$LIBREOFFICEPACKAGE \
    && rm -rf /tmp/LibreOffice
COPY start-libreoffice.sh /tmp/


# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy sourcecode
COPY . .
COPY resource/fonts /usr/share/fonts

COPY wait-for-it.sh /
RUN chmod 755 /wait-for-it.sh /tmp/start-libreoffice.sh
RUN /tmp/start-libreoffice.sh

# Start app
CMD /wait-for-it.sh mysql:3306 -- npm start
