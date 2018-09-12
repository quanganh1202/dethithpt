# Use Node v8.9.0 LTS
FROM node:carbon as builder
USER node

RUN mkdir -p /tmp/app
WORKDIR /tmp/app
COPY ./package*.json ./
RUN npm install
COPY --chown=node . .
RUN npm run build

FROM nginx
WORKDIR /var/www/app
COPY --from=builder /tmp/app/build/ /var/www/app/