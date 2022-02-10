#!/bin/sh

sudo docker-compose --verbose -f docker-compose.$1.yml build --no-cache 