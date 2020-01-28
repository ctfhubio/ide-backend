FROM node:10-alpine

RUN apk add g\+\+ make gcc python linux-headers paxctl gnupg

WORKDIR /home/node/app

COPY package*.json ./

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:/home/node/.npm-global/bin

RUN chown node:node /home/node -R

RUN npm install --only=production

COPY --chown=node:node . .

USER node

CMD ["node", "api/server.js"]
