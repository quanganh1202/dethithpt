curl -X DELETE "localhost:9200/users"

curl -X PUT "localhost:9200/users" -H 'Content-Type: application/json' -d @'./resource/user.mapping.json'

curl -X POST "localhost:9200/users/user/1?op_type=create" -H 'Content-Type: application/json' -d '{"name":"administator","email":"vuanhdung.khmt2k7@gmail.com","role":"admin","status": 2,"numOfDownloaded": 0,"numOfUploaded": 0, "money": 0}'

curl -X POST "localhost:9200/users/user/2?op_type=create" -H 'Content-Type: application/json' -d '{"name":"administator","email":"vuanhdung.khmt2@gmail.com","role":"admin","status": 2,"numOfDownloaded": 0,"numOfUploaded": 0, "money": 0}'

curl -X POST "localhost:9200/users/user/3?op_type=create" -H 'Content-Type: application/json' -d '{"name":"administator","email":"quanganh1202@gmail.com","role":"admin","status": 2,"numOfDownloaded": 0,"numOfUploaded": 0, "money": 0}'

curl -X POST "localhost:9200/users/user/4?op_type=create" -H 'Content-Type: application/json' -d '{"name":"administator","email":"tdgalaxycorp@gmail.com","role":"admin","status": 2,"numOfDownloaded": 0,"numOfUploaded": 0, "money": 0}'

curl -X POST "localhost:9200/users/user/5?op_type=create" -H 'Content-Type: application/json' -d '{"name":"administator","email":"phamdung282@gmail.com","role":"admin","status": 2,"numOfDownloaded": 0,"numOfUploaded": 0, "money": 0}'

curl -X POST "localhost:9200/users/user/6?op_type=create" -H 'Content-Type: application/json' -d '{"name":"administator","email":"nguoiran2000@gmail.com","role":"admin","status": 2,"numOfDownloaded": 0,"numOfUploaded": 0, "money": 0}'