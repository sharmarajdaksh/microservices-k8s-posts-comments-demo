FROM node:15-alpine3.11

WORKDIR /app
COPY package.json ./
RUN npm install 
COPY ./ ./

CMD ["npm", "start"]