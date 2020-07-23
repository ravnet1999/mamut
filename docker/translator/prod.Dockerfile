FROM node:14.5.0

COPY ./src/translator/ /app/

WORKDIR /app

RUN npm install forever -g
RUN npm install

CMD DEBUG=app:* & npm run start