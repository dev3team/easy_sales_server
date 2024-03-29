FROM node:lts-alpine


WORKDIR /app

RUN apk update && apk add --no-cache nmap && \
    echo @edge https://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge https://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package.json /app

RUN npm install

COPY . .
ENV PORT 3306

EXPOSE $PORT

CMD ["node", "src/app.js"]