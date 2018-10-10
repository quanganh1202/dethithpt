# Use Node v8.9.0 LTS
FROM node:carbon as builder
USER node

RUN mkdir -p /tmp/app
WORKDIR /tmp/app
COPY ./frontend/package.json ./
RUN npm install
COPY --chown=node ./frontend/ .
RUN npm run build

RUN mkdir -p /tmp/admin
WORKDIR /tmp/admin
COPY ./frontend_admin/package.json ./
RUN npm install
COPY --chown=node ./frontend_admin/ .
RUN npm run build

FROM nginx:1.10.2
WORKDIR /usr/share/nginx/html
COPY --from=builder /tmp/app/build/ /usr/share/nginx/html/frontend/
COPY --from=builder /tmp/admin/build/ /usr/share/nginx/html/admin/
COPY nginx.conf.default /etc/nginx/conf.d/mysite.template
