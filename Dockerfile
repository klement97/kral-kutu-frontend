# Build env
FROM node:15.4.0-slim as node_modules
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i

FROM node:15.4.0-slim as dist
WORKDIR /app
COPY --from=node_modules /app/node_modules /app/node_modules
COPY . .
COPY --from=node_modules /app/package.json /app/package-lock.json /app/
RUN npm run build

# Final image
FROM nginx:1.19.5-alpine
COPY --from=dist /app/dist/kral-kutu-frontend /usr/share/nginx/html

RUN apk add --no-cache supervisor
RUN apk add --no-cache bash

RUN mkdir -p /var/log/supervisord && \
 touch supervisord.log

COPY config/nginx.conf /etc/nginx/nginx.conf
COPY config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
