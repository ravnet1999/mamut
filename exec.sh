#!/bin/sh

sudo docker-compose -f docker-compose.$1.yml exec $2 $3