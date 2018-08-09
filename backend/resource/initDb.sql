CREATE SCHEMA `dethithpt` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE dethithpt;

CREATE TABLE `dethithpt`.`tbUser` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(45) NULL,
  `phone` VARCHAR(20) NOT NULL,
  `role` VARCHAR(20) NOT NULL,
  `bod` YEAR(4) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `district` VARCHAR(50) NOT NULL,
  `level` VARCHAR(45) NOT NULL,
  `school` VARCHAR(45) NOT NULL,
  `facebook` VARCHAR(45) NULL,
  `position` VARCHAR(45) NOT NULL,
  `surplus` VARCHAR(45) DEFAULT '0',
  `totalIncome` VARCHAR(45) DEFAULT '0',
  `recharge` VARCHAR(45) DEFAULT '0',
  `active` TINYINT DEFAULT '1',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC));
  
CREATE TABLE `dethithpt`.`tbDocument` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `tags` VARCHAR(255) NULL,
  `description` LONGTEXT NULL,
  `userId` VARCHAR(50) NOT NULL,
  `price` VARCHAR(50) NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `category` VARCHAR(45) NOT NULL,
  `path` MEDIUMTEXT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));
