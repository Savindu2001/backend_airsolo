npx sequelize-cli db:migrate



npx sequelize-cli model:generate --name User --attributes "name:string,email:string,password:string,username:string,nic:string,profile_photo:string,createdAt:date,updatedAt:date"

npx sequelize-cli db:create

npx sequelize-cli init   



# super access 
`sudo lsof -i -P -n | grep LISTEN`



npx sequelize-cli seed:generate --name demo-users
