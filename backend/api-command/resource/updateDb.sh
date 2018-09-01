
echo "Please enter account, password"
echo "------------------------------------------------------"

echo -n "Account: "
read ACCOUNT

echo -n "Password: "
read -s PASSWORD

echo
echo -n "Database: "
read DATABASE

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
    cates VARCHAR(255) NULL,
    path MEDIUMTEXT NULL,
    subjectId INT(11) NULL,
    classId INT(11) NULL,
    yearSchool INT(11) NULL,
    collectionId INT(11) NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  DROP TABLE $DATABASE.tbCategory;

  CREATE TABLE IF NOT EXISTS tbCategory (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    userId TEXT(15) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC),
    UNIQUE INDEX name_UNIQUE (name ASC));

  DROP TABLE $DATABASE.tbCollection;

  CREATE TABLE IF NOT EXISTS tbCollection (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    cateId INT NOT NULL,
    classId INT NOT NULL,
    subjectId INT NOT NULL,
    userId INT(11) NOT NULL,
    yearSchool INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));
"
if [ $? == 0 ]
then
  echo "-------------------DONE-------------------"
else
  echo "-------------------ERROR-------------------"
fi