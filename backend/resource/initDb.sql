CREATE SCHEMA `dethithpt` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

USE dethithpt;

CREATE TABLE `dethithpt`.`tbUser` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(45) NULL,
  `phone` VARCHAR(20) NOT NULL,
  `role` VARCHAR(20) NOT NULL,
  `bod` VARCHAR(4) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `district` VARCHAR(50) NOT NULL,
  `level` VARCHAR(45) NOT NULL,
  `school` VARCHAR(45) NOT NULL,
  `facebook` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC));