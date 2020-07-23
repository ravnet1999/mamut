#!/bin/sh

sudo docker-compose -f docker-compose.$1.yml up $2 -d