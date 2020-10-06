#!/bin/sh

sudo docker-compose -f docker-compose.dev.yml exec $1 /bin/sh /app/scripts/build-frontend.sh

sudo rm -rf src/backend/public/admin/*
rsync -avz src/frontend/build/* src/backend/public/admin/
sudo chown -R $2:$3 src/backend/public/admin/*

sudo rm -rf src/backend/public/parser/*
rsync -avz src/frontend_parser/build/* src/backend/public/parser/
sudo chown -R $2:$3 src/backend/public/parser/*