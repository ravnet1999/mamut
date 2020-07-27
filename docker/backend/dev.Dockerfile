FROM node:14.5.0

COPY ./src/backend/ /app/

RUN npm install -g nodemon

CMD npm --prefix /app install & DEBUG=app:* & npm --prefix /app run start_dev