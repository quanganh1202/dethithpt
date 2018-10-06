# Use Node v8.9.0 LTS
FROM node:carbon

# Setup app working directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get install graphicsmagick ghostscript -y
ENV DEBIAN_FRONTEND noninteractive

RUN useradd -m libreoffice; \
    apt-get update \
    && apt-get install -y --no-install-recommends wget \
                                                  libdbus-glib-1-2 \
                                                  libsm6 \
                                                  openjdk-7-jre \
    && rm -rf /var/lib/apt/lists/*

ENV LIBREOFFICEPACKAGE LibreOffice_5.3.4_Linux_x86-64_deb.tar.gz
ENV LIBREOFFICEDIR LibreOffice_5.3.4.2_Linux_x86-64_deb

RUN wget -q http://mirror.switch.ch/ftp/mirror/tdf/libreoffice/stable/5.3.4/deb/x86_64/$LIBREOFFICEPACKAGE -O /tmp/$LIBREOFFICEPACKAGE \
    && mkdir /tmp/LibreOffice \
    && tar -xzf /tmp/$LIBREOFFICEPACKAGE -C /tmp/LibreOffice \
    && dpkg -i /tmp/LibreOffice/$LIBREOFFICEDIR/DEBS/*.deb \
    && rm -f /tmp/$LIBREOFFICEPACKAGE \
    && rm -rf /tmp/LibreOffice

COPY start-libreoffice.sh /tmp/

ENTRYPOINT ["/tmp/start-libreoffice.sh"]

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy sourcecode
COPY . .
COPY resource/fonts /usr/share/fonts


# Start app
CMD /wait-for-it.sh mysql:3306 -- npm start
