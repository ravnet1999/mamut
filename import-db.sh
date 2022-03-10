#!/bin/sh
sudo docker-compose -f docker-compose.mysql-8.0.$1.yml exec -T mamut-app-mysql-8.0 /bin/sh -c "/usr/bin/mysql -u$2 -p$3 < /scripts/Mamut_2_Dump20220112.sql"
