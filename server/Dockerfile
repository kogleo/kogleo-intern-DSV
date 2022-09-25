FROM node:14-alpine

WORKDIR /app

ENV MONGODB_URL=mongodb+srv://kogleo:a01664423375A@conduit.gltbefq.mongodb.net/?retryWrites=true&w=majority
ENV PORT=80
ENV ACCESS_TOKEN_SECRET=AF18082001
ENV REFRESH_TOKEN_SECRET=KOGLEO


COPY package.json .

RUN npm install

COPY . .

CMD ["node", "app.js"]