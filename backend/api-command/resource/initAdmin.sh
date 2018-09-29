echo -n "Enter your administator's email: "
read EMAIL
mysql -u$ACCOUNT -p$PASSWORD -e "INSERT INTO $DATABASE.tbUser(name, email, role, status) VALUES ('administator', '$EMAIL', 'admin', '1')"
curl -X POST "localhost:9200/users/user/1" -H 'Content-Type: application/json' -d '{"name":"administator","email":"'$EMAIL'","role":"admin","status": 1}'