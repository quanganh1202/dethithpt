GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
# Init folder log
mkdir -p logs
# Init folder store
mkdir -p storage

echo "-------------------Creating database-------------------"

mysql -u$ACCOUNT -p$PASSWORD -e "
  CREATE SCHEMA IF NOT EXISTS $DATABASE DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

  USE $DATABASE;

  CREATE TABLE IF NOT EXISTS $DATABASE.tbUser (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(45) NULL,
    phone VARCHAR(20) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    bod YEAR(4) NULL,
    city VARCHAR(50) NULL,
    district VARCHAR(50) NULL,
    level VARCHAR(45) NULL,
    school VARCHAR(45) NULL,
    class VARCHAR(45) NULL,
    facebook VARCHAR(45) NULL,
    position VARCHAR(45) NULL,
    note1 TEXT(255) NULL,
    note2 TEXT(255) NULL,
    blockFrom TIMESTAMP NULL,
    blockDownloadCollections VARCHAR(255) NULL,
    blockDownloadCategories VARCHAR(255) NULL,
    blockDownloadSubjects VARCHAR(255) NULL,
    money VARCHAR(255) DEFAULT '0',
    status TINYINT DEFAULT '2',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notifyText VARCHAR(255) NULL,
    notifyStatus TINYINT DEFAULT '0',
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
    price VARCHAR(255) NOT NULL DEFAULT '0',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    path MEDIUMTEXT NULL,
    cateIds VARCHAR(255) NULL,
    subjectIds VARCHAR(255) NULL,
    note TEXT(255) NULL,
    classIds VARCHAR(255) NULL,
    yearSchools VARCHAR(255) NULL,
    collectionIds VARCHAR(255) NULL,
    totalPages INT(11) NOT NULL DEFAULT '0',
    priority INT(1) NOT NULL DEFAULT '0',
    approved TINYINT DEFAULT '0',
    approverId VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbCategory (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT(255) NOT NULL,
    userId TEXT(15) NOT NULL,
    priority INT(1) NOT NULL DEFAULT '0',
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
    priority INT(1) NOT NULL DEFAULT '0',
    yearSchools VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbPurchase(
    id INT NOT NULL AUTO_INCREMENT,
    userId VARCHAR(255) NOT NULL,
    docId VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    money VARCHAR(255) NOT NULL DEFAULT '0',
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

  CREATE TABLE IF NOT EXISTS $DATABASE.tbNews (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    text LONGTEXT NOT NULL,
    priority INT(1) NOT NULL DEFAULT '0',
    active INT(1) NOT NULL DEFAULT '1',
    userId VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE IF NOT EXISTS $DATABASE.tbComment (
    id INT NOT NULL AUTO_INCREMENT,
    docId INT NOT NULL,
    content LONGTEXT NOT NULL,
    userId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC));

  INSERT INTO $DATABASE.tbUser(
    name,
    email,
    role,
    status
  ) VALUES ('administator', 'vuanhdung.khmt2k7@gmail.com', 'admin', '2');

  INSERT INTO $DATABASE.tbUser(
    name,
    email,
    role,
    status
  ) VALUES ('administator', 'vuanhdung.khmt2@gmail.com', 'admin', '2');

    INSERT INTO $DATABASE.tbUser(
    name,
    email,
    role,
    status
  ) VALUES ('administator', 'quanganh1202@gmail.com', 'admin', '2');

  INSERT INTO $DATABASE.tbUser(
    name,
    email,
    role,
    status
  ) VALUES ('administator', 'tdgalaxycorp@gmail.com', 'admin', '2');

  INSERT INTO $DATABASE.tbUser(
    name,
    email,
    role,
    status
  ) VALUES ('administator', 'phamdung282@gmail.com', 'admin', '2');

  INSERT INTO $DATABASE.tbUser(
    name,
    email,
    role,
    status
  ) VALUES ('administator', 'nguoiran2000@gmail.com', 'admin', '2');
"

if [ $? == 0 ]
then
  echo -e "${GREEN}-------------------SUCCESS-------------------${NC}"
else
  echo -e "${RED}-------------------ERROR-------------------${NC}"
fi