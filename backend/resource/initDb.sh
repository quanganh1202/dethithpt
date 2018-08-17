
echo "Please enter account, password"
echo "------------------------------------------------------"

echo -n "Account: "
read ACCOUNT

echo -n "Password: "
read -s PASSWORD

echo
echo -n "Database: "
read DATABASE

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
    surplus VARCHAR(45) DEFAULT '0',
    totalIncome VARCHAR(45) DEFAULT '0',
    recharge VARCHAR(45) DEFAULT '0',
    active TINYINT DEFAULT '2',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC),
    UNIQUE INDEX email_UNIQUE (email ASC),
    UNIQUE INDEX phone_UNIQUE (phone ASC));


  CREATE TABLE IF NOT EXISTS $DATABASE.tbDocument (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    tags VARCHAR(255) NULL,
    description LONGTEXT NULL,
    userId INT(11) NOT NULL,
    price VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cateId INT(11) NOT NULL,
    path MEDIUMTEXT NOT NULL,
    subjectId INT(11) NOT NULL,
    classId INT(11) NOT NULL,
    yearSchoolId INT(11) NOT NULL,
    collectionId INT(11) NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbCategory (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC),
    UNIQUE INDEX name_UNIQUE (name ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbSubject (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbClass (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbYearSchool (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbCollection (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    cateId INT NOT NULL,
    classId INT NOT NULL,
    subjectId INT NOT NULL,
    yearSchoolId INT NOT NULL,
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