-- Eduvo CRM Database Schema
-- Run this script to create the database and tables manually.

CREATE DATABASE IF NOT EXISTS eduvo_crm;
USE eduvo_crm;

-- -----------------------------------------------------
-- Table `Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN', 'SALES_EXECUTIVE') DEFAULT 'SALES_EXECUTIVE',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DemoRequests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DemoRequests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contact_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `institution_name` VARCHAR(255) NOT NULL,
  `institution_type` VARCHAR(255) DEFAULT NULL,
  `student_count` VARCHAR(50) DEFAULT NULL,
  `interested_features` JSON DEFAULT NULL,
  `preferred_demo_datetime` DATETIME NOT NULL,
  `requirements` TEXT DEFAULT NULL,
  `status` ENUM('New', 'Contacted', 'Demo Scheduled', 'Demo Completed', 'Converted', 'Lost', 'Cancelled') DEFAULT 'New',
  `assigned_to` INT DEFAULT NULL,
  `next_followup_date` DATETIME DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_demorequest_user_idx` (`assigned_to` ASC),
  CONSTRAINT `fk_demorequest_user`
    FOREIGN KEY (`assigned_to`)
    REFERENCES `Users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FollowupNotes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FollowupNotes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `demo_request_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `note` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_note_request_idx` (`demo_request_id` ASC),
  INDEX `fk_note_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_note_request`
    FOREIGN KEY (`demo_request_id`)
    REFERENCES `DemoRequests` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_note_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ActivityLogs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ActivityLogs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `demo_request_id` INT NOT NULL,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(255) NOT NULL,
  `old_value` VARCHAR(255) DEFAULT NULL,
  `new_value` VARCHAR(255) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_activity_request_idx` (`demo_request_id` ASC),
  INDEX `fk_activity_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_activity_request`
    FOREIGN KEY (`demo_request_id`)
    REFERENCES `DemoRequests` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_activity_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `Users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB;
