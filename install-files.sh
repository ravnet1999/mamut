#!/bin/sh

cp ./src/backend/config/database.json.example ./src/backend/config/database.json
echo ./src/backend/config/database.json
cp ./src/backend/middleware/access.js.example ./src/backend/middleware/access.js
cp ./src/backend/middleware/json.js.example ./src/backend/middleware/json.js
cp ./src/frontend/src/Config/appConfig.json.example ./src/frontend/src/Config/appConfig.json
cp ./src/frontend_parser/src/Config/appConfig.json.example ./src/frontend_parser/src/Config/appConfig.json
cp ./src/parser/config/database.json.example ./src/parser/config/database.json
echo ./src/parser/config/database.json
cp ./src/parser/config/email.json.example ./src/parser/config/email.json
echo ./src/parser/config/email.json
cp ./src/parser/config/accounts.json.example ./src/parser/config/accounts.json
echo ./src/parser/config/accounts.json
cp ./src/parser/middleware/access.js.example ./src/parser/middleware/access.js
cp ./src/parser/middleware/json.js.example ./src/parser/middleware/json.js
cp ./src/translator/config/database.json.example ./src/translator/config/database.json
echo ./src/translator/config/database.json
cp ./src/mongodb/scripts/add_user.js.example ./src/mongodb/scripts/add_user.js
echo ./src/mongodb/scripts/add_user.js