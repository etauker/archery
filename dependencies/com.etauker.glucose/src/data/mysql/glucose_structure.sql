USE `etauker_glucose`;
--
-- DROP TABLES
--
DROP TABLE IF EXISTS `TRANSACTION`;

--
-- CREATE TABLES
--
--
-- Table structure for table `TRANSACTION`
--
-- Creation: Nov 21, 2017 at 11:30 PM
-- Last update: Oct 25, 2018 at 06:36 PM
--

CREATE TABLE `TRANSACTION` (
  `id` 	                char(36) 		PRIMARY KEY,
  `date_time`           datetime        DEFAULT NULL,
  `reading`             float(3,1)      DEFAULT NULL,
  `carbohydrates`       smallint(6)     DEFAULT NULL,
  `insulin_units_short` tinyint(3)      UNSIGNED DEFAULT NULL,
  `insulin_units_long`  tinyint(3)      UNSIGNED DEFAULT NULL,
  `meal`                varchar(20)     DEFAULT NULL,
  `note`                text            ,
  `correction_units`    tinyint(3)      UNSIGNED DEFAULT NULL,
  `created_by`		    char(36)		,
  `created_at`		    timestamp 		DEFAULT CURRENT_TIMESTAMP,
  `updated_by`          char(36)		,
  `updated_at`          timestamp 		DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=latin1;


--
-- ALTER TABLES
--
-- TRANSACTION
DELIMITER $$
CREATE TRIGGER `insert_id_TRANSACTION`
BEFORE INSERT ON `TRANSACTION`
FOR EACH ROW BEGIN
    IF (NEW.id IS NULL OR NEW.id = '') THEN
        SET NEW.id = UUID();
    END IF;
END
$$

DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_updated_at_TRANSACTION`
BEFORE UPDATE ON `TRANSACTION`
FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP();
END
$$
DELIMITER ;
