FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./Docker-back-end

RUN npm install

EXPOSE 3000
CMD [ "nodemon", "src/server.js" ]
