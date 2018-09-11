CREATE SCHEMA `dethithpt` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE dethithpt;

CREATE TABLE IF NOT EXISTS `dethithpt`.`tbUser` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(45) NULL,
  `phone` VARCHAR(20) NULL,
  `role` VARCHAR(20)  NULL,
  `bod` YEAR(4) NULL,
  `city` VARCHAR(50) NULL,
  `district` VARCHAR(50) NULL,
  `level` VARCHAR(45) NULL,
  `school` VARCHAR(45) NULL,
  `facebook` VARCHAR(45) NULL,
  `position` VARCHAR(45) NULL,
  `surplus` VARCHAR(45) DEFAULT '0',
  `totalIncome` VARCHAR(45) DEFAULT '0',
  `recharge` VARCHAR(45) DEFAULT '0',
  `status` TINYINT DEFAULT '2',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC));

CREATE TABLE IF NOT EXISTS `dethithpt`.`tbDocument` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `tags` VARCHAR(255) NULL,
  `description` LONGTEXT NULL,
  `userId` INT(11) NOT NULL,
  `price` VARCHAR(50) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `cateIds` VARCHAR(255) NULL,
  `path` MEDIUMTEXT NOT NULL,
  `subjectId` INT(11) NOT NULL,
  `classId` INT(11) NOT NULL,
  `yearSchool` INT(11) NOT NULL,
  `collectionId` INT(11) NULL,
  `totalPages` INT(11) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));

CREATE TABLE IF NOT EXISTS `dethithpt`.`tbCategory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT(255) NOT NULL,
  `userId` TEXT(15) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC));

CREATE TABLE IF NOT EXISTS `dethithpt`.`tbSubject` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));

CREATE TABLE IF NOT EXISTS `dethithpt`.`tbClass` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));

CREATE TABLE IF NOT EXISTS `dethithpt`.`tbCollection` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT(255) NOT NULL,
  `cateId` INT NOT NULL,
  `classId` INT NOT NULL,
  `subjectId` INT NOT NULL,
  `yearSchool` INT NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));