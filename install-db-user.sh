#!/bin/sh

cp ./src/backend/config/database.json.example ./src/backend/config/database.json
cp ./src/backend/middleware/cors.js.example ./src/backend/middleware/cors.js
cp ./src/frontend/src/Config/appConfig.json.example ./src/frontend/src/Config/appConfig.json
cp ./src/parser/config/database.json.example ./src/parser/config/database.json
cp ./src/parser/middleware/cors.js.example ./src/parser/middleware/cors.js
cp ./src/translator/config/database.json.example ./src/translator/config/database.json
cp ./src/mongodb/scripts/add_user.js.example ./src/mongodb/scripts/add_user.js

sudo docker-compose -f docker-compose.$1.yml exec -T mamut-app-db /bin/sh -c "/usr/bin/mongo -u $2 --password $3 < /scripts/add_user.js"

sh ./stop.sh $1
sh ./start.sh $1