make codegen     
sleep 1                     
make build
sleep 1                     

make down
sleep 1                     

rm -rf db/migrations/*.js
sleep 1                     

make up
sleep 1                     

npx squid-typeorm-migration generate
sleep 1                     

make migrate
sleep 1                     

make process


#make serve to run sql server