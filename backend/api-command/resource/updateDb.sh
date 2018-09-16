echo "-------------------Updating database-------------------"

mysql -u$ACCOUNT -p$PASSWORD -e "
  USE $DATABASE;

  DROP TABLE $DATABASE.tbDocument;

  CREATE TABLE IF NOT EXISTS $DATABASE.tbDocument (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    tags VARCHAR(255) NOT NULL,
    description LONGTEXT NULL,
    userId INT(11) NOT NULL,
    price VARCHAR(50) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cateIds VARCHAR(255) NULL,
    path MEDIUMTEXT NULL,
    subjectId INT(11) NULL,
    classId INT(11) NULL,
    yearSchool INT(11) NULL,
    collectionId INT(11) NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));
"
if [ $? == 0 ]
then
  echo "-------------------DONE-------------------"
else
  echo "-------------------ERROR-------------------"
fi