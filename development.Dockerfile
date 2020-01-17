FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm i

COPY tsconfig.json ./
COPY ./src ./src

CMD ["npm", "run", "dev"]