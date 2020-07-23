#!/bin/sh

sudo docker-compose -f docker-compose.$1.yml exec $2 /bin/sh -c "cd /app & npm install --save $3"