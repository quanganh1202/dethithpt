GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
# Init folder log
mkdir -p logs
# Init folder store
mkdir -p storage

echo "-------------------Creating database-------------------"

mysql -u$ACCOUNT -p$PASSWORD -e "
  CREATE SCHEMA $DATABASE DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

  USE $DATABASE;

  CREATE TABLE IF NOT EXISTS $DATABASE.tbUser (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(45) NULL,
    phone VARCHAR(20) NULL,
    role VARCHAR(20) NULL,
    bod YEAR(4) NULL,
    city VARCHAR(50) NULL,
    district VARCHAR(50) NULL,
    level VARCHAR(45) NULL,
    school VARCHAR(45) NULL,
    facebook VARCHAR(45) NULL,
    position VARCHAR(45) NULL,
    money VARCHAR(45) DEFAULT '0',
    status TINYINT DEFAULT '2',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC),
    UNIQUE INDEX email_UNIQUE (email ASC),
    UNIQUE INDEX phone_UNIQUE (phone ASC));

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
    totalPages INT(11) NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbCategory (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    userId TEXT(15) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC),
    UNIQUE INDEX name_UNIQUE (name ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbSubject (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    userId INT(11) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbClass (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    userId INT(11) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbCollection (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    cateIds VARCHAR(255) NOT NULL,
    classIds VARCHAR(255) NOT NULL,
    subjectIds VARCHAR(255) NOT NULL,
    userId INT(11) NOT NULL,
    yearSchools VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbPurchase(
    id INT NOT NULL AUTO_INCREMENT,
    userId VARCHAR(255) NOT NULL,
    docId VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    money VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbRole (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    roles VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));
"

if [ $? == 0 ]
then
  echo -e "${GREEN}-------------------INIT DATABASE IS DONE-------------------${NC}"
  echo "Init an account for administrator"
  echo -n "Enter your administator's email: "
  read EMAIL
  mysql -u$ACCOUNT -p$PASSWORD -e "INSERT INTO $DATABASE.tbUser(name, email, role) VALUES ('administator', '$EMAIL', 'admin')"
  if [ $? == 0 ]
  then
    echo
    echo -e "Init administrator's account is done with name = ${GREEN}'administrator'${NC} and email = ${GREEN}'$EMAIL'${NC}.\nLogin with above email to update infomation"
    echo -e "${GREEN}-------------------DONE-------------------${NC}"
  else
    echo -e "${RED}Init error${NC}"
  fi
else
  echo -e "${RED}-------------------ERROR-------------------${NC}"
fi