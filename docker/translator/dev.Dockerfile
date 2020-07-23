FROM node:14.5.0

COPY ./src/translator/ /app/

WORKDIR /app

RUN npm install -g nodemon
RUN npm install

CMD DEBUG=app:* & npm run start_dev