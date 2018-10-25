USE etauker_glucose;

--
-- DROP TABLES
--
-- DROP TABLE IF EXISTS TRANSACTION;

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
  `id` 	                CHAR(36) 		PRIMARY KEY,
  `date_time`           datetime        DEFAULT NULL,
  `reading`             float(3,1)      DEFAULT NULL,
  `carbohydrates`       smallint(6)     DEFAULT NULL,
  `insulin_units_short` tinyint(3)      UNSIGNED DEFAULT NULL,
  `insulin_units_long`  tinyint(3)      UNSIGNED DEFAULT NULL,
  `note`                text            ,
  `correction_units`    tinyint(3)      UNSIGNED DEFAULT NULL,
  `created_by`		    CHAR(36)		,
  `created_at`		    TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP,
  `updated_by`          CHAR(36)		,
  `updated_at`          TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


--
-- ALTER TABLES
--
-- TRANSACTION
DELIMITER #
CREATE TRIGGER insert_uuid_TRANSACTION
BEFORE INSERT ON TRANSACTION
FOR EACH ROW
BEGIN
    IF (NEW.id IS NULL OR NEW.id = '') THEN
        SET NEW.id = UUID();
    END IF;
END;
#
DELIMITER ;
