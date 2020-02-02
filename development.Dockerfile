FROM node:12-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm i

COPY tsconfig.json ./

CMD ["npm", "run", "start:dev"]