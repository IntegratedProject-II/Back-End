FROM node:14
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . /usr/src/app
RUN npm run prisma:generate
EXPOSE 9000
CMD ["npm","run","start"]
