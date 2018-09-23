echo "-------------------Updating database-------------------"

mysql -u$ACCOUNT -p$PASSWORD -e "
  USE $DATABASE;

  DROP TABLE IF EXISTS $DATABASE.tbDocument;

  CREATE TABLE IF NOT EXISTS $DATABASE.tbDocument (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    tags VARCHAR(255) NOT NULL,
    description LONGTEXT NULL,
    userId INT(11) NOT NULL,
    price VARCHAR(255) NOT NULL DEFAULT '0',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    path MEDIUMTEXT NULL,
    cateIds VARCHAR(255) NULL,
    subjectIds VARCHAR(255) NULL,
    classIds VARCHAR(255) NULL,
    yearSchools VARCHAR(255) NULL,
    collectionIds VARCHAR(255) NULL,
    totalPages INT(11) NULL,
    approved TINYINT DEFAULT '0',
    approverId VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));
"
if [ $? == 0 ]
then
  echo "-------------------DONE-------------------"
else
  echo "-------------------ERROR-------------------"
fi