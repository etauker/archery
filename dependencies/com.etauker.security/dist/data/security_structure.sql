--
-- DROP TABLES
--
-- Drop tables in reverse to avoid foreign key checks
--

-- USE `etauker`;

DROP TABLE IF EXISTS SESSION_EXTENSION;
DROP TABLE IF EXISTS USER_ROLE;
DROP TABLE IF EXISTS SESSION;
DROP TABLE IF EXISTS USER;
DROP TABLE IF EXISTS ROLE;





--
-- CREATE TABLES
--

CREATE TABLE ROLE (
	id				CHAR(36) 		PRIMARY KEY,
	name			VARCHAR(75)		UNIQUE NOT NULL,
	description		VARCHAR(255)    ,
	created_by		CHAR(36)		,
	created_at		TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP,
	updated_by      CHAR(36)		,
	updated_at      TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE USER (
	uuid			CHAR(36) 		PRIMARY KEY,
	username		VARCHAR(75)		UNIQUE NOT NULL,
	password_hash	VARCHAR(255)	NOT NULL,		-- use VARCHAR(255) as hashing algorithm may change
    created_by		CHAR(36)		,
    created_at		TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP,
    updated_by      CHAR(36)		,
    updated_at      TIMESTAMP 		DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE SESSION (
	id				CHAR(36) 		  PRIMARY KEY,
    jwt			    TEXT      		  NOT NULL,
	jwt_algorithm	VARCHAR(25)       ,  -- The algorithm that can be used to decode the jwt
	user_id			CHAR(36)          ,  -- The user_id of the session owner
	original_exp	DATETIME          ,  -- The date and time of the original token expiration
	original_iat	DATETIME          ,  -- The date and time of the original token generation
	info			VARCHAR(255) 	  ,  -- Additional information about the session
	invalid 		TINYINT 		  DEFAULT 0
);
CREATE TABLE USER_ROLE (
	role_id				CHAR(36),
	user_id			    CHAR(36),
	PRIMARY KEY (user_id, role_id)
);
CREATE TABLE SESSION_EXTENSION (
	id				CHAR(36) 		    PRIMARY KEY,
	session_id		CHAR(36)            ,
	new_exp 	    DATETIME            ,  -- The date and time of the extension token expiration
	new_iat	        DATETIME               -- The date and time of the extension token generation
);



--
-- ALTER TABLES
--
-- Add foreign keys
--

ALTER TABLE SESSION
ADD CONSTRAINT FK_SESSION_user_id FOREIGN KEY (user_id) REFERENCES USER(uuid) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE USER_ROLE
ADD CONSTRAINT FK_USER_ROLE_user_id FOREIGN KEY (user_id) REFERENCES USER(uuid) ON UPDATE CASCADE ON DELETE CASCADE,
ADD CONSTRAINT FK_USER_ROLE_role_id FOREIGN KEY (role_id) REFERENCES ROLE(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE SESSION_EXTENSION
ADD CONSTRAINT FK_SESSION_EXTENSION_session_id FOREIGN KEY (session_id) REFERENCES SESSION(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- ROLE
DELIMITER $$
CREATE TRIGGER insert_guid_ROLE
BEFORE INSERT ON ROLE
FOR EACH  ROW
BEGIN
    SET NEW.id = UUID();
END;
$$
DELIMITER ;

-- USER
DELIMITER $$
CREATE TRIGGER insert_guid_USER
BEFORE INSERT ON USER
FOR EACH  ROW
BEGIN
    SET NEW.uuid = UUID();
END;
$$
DELIMITER ;


-- SESSION
DELIMITER $$
CREATE TRIGGER insert_guid_SESSION
BEFORE INSERT ON SESSION
FOR EACH  ROW
BEGIN
	IF (NEW.id IS NULL OR NEW.id = '') THEN
		SET NEW.id = UUID();
  	END IF;
END;
$$
DELIMITER ;


-- SESSION_EXTENSION
DELIMITER $$
CREATE TRIGGER insert_guid_SESSION_EXTENSION
BEFORE INSERT ON SESSION_EXTENSION
FOR EACH  ROW
BEGIN
    SET NEW.id = UUID();
END;
$$
DELIMITER ;
