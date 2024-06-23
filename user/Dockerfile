FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npx prisma migrate dev

EXPOSE 8080

CMD [ "npm","start" ]