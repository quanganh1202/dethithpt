CREATE SCHEMA `dethithpt` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE dethithpt;

  CREATE TABLE IF NOT EXISTS `dethithpt`.`tbUser` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(45) NULL,
    `phone` VARCHAR(20) NULL,
    `role` VARCHAR(20) NULL,
    `bod` YEAR(4) NULL,
    `city` VARCHAR(50) NULL,
    `district` VARCHAR(50) NULL,
    `level` VARCHAR(45) NULL,
    `school` VARCHAR(45) NULL,
    `facebook` VARCHAR(45) NULL,
    `position` VARCHAR(45) NULL,
    `money` VARCHAR(255) DEFAULT '0',
    `status` TINYINT DEFAULT '2',
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC),
    UNIQUE INDEX `email_UNIQUE` (`email` ASC),
    UNIQUE INDEX `phone_UNIQUE` (`phone` ASC));

  CREATE TABLE IF NOT EXISTS `dethithpt`.`tbDocument` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `tags` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NULL,
    `userId` INT(11) NOT NULL,
    `price` VARCHAR(255) NOT NULL DEFAULT '0',
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `path` MEDIUMTEXT NULL,
    `cateIds` VARCHAR(255) NULL,
    `subjectIds` VARCHAR(255) NULL,
    `classIds` VARCHAR(255) NULL,
    `yearSchools` VARCHAR(255) NULL,
    `collectionIds` VARCHAR(255) NULL,
    `totalPages` INT(11) NULL,
    `approved` TINYINT DEFAULT '0',
    `approverId` VARCHAR(255),
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
    `userId` INT(11) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC));

  CREATE TABLE IF NOT EXISTS `dethithpt`.`tbClass` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` TEXT(255) NOT NULL,
    `userId` INT(11) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC));

  CREATE TABLE IF NOT EXISTS `dethithpt`.`tbCollection` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `cateIds` VARCHAR(255) NOT NULL,
    `classIds` VARCHAR(255) NOT NULL,
    `subjectIds` VARCHAR(255) NOT NULL,
    `userId` INT(11) NOT NULL,
    `yearSchools` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC));

  CREATE TABLE IF NOT EXISTS `dethithpt`.`tbPurchase`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(255) NOT NULL,
    `docId` VARCHAR(255),
    `money` VARCHAR(255) NOT NULL DEFAULT '0',
    `action` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC));

  CREATE TABLE IF NOT EXISTS `dethithpt`.`tbRole` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `roles` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC));