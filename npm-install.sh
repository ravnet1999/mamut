#!/bin/sh

sudo docker-compose -f docker-compose.dev.yml exec $1 /bin/sh -c "npm --prefix /app install --save $2"