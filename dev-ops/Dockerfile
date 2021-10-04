FROM node:10

WORKDIR /opt

COPY ./build/ .

RUN ls

COPY ./appServer.js .

COPY ./package.json .

RUN npm install --production

EXPOSE {PORT}

CMD [ "node", "appServer.js" ]