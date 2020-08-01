FROM node:14.5.0

COPY ./src/parser/ /app/

RUN npm install forever -g

CMD npm --prefix /app install & DEBUG=app:* & npm --prefix /app run start