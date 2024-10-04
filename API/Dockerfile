FROM node:20-bookworm-slim

RUN apt-get update && apt-get install curl -y

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
