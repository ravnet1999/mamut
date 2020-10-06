#!/bin/sh

sudo docker-compose -f docker-compose.dev.yml exec $1 /bin/sh /app/scripts/build-frontend.sh

mkdir src/backend/public
mkdir src/backend/public/admin
mkdir src/parser/public
mkdir src/parser/public/admin

sudo rm -rf src/backend/public/admin/*
rsync -avz src/frontend/build/* src/backend/public/admin/
sudo chown -R $2:$3 src/backend/public/admin/*

sudo rm -rf src/parser/public/admin/*
rsync -avz src/frontend_parser/build/* src/parser/public/admin/
sudo chown -R $2:$3 src/parser/public/admin/*