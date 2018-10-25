USE etauker_archery;

DROP TABLE IF EXISTS ar_club;
CREATE TABLE ar_club (
    uuid            BINARY(16)      PRIMARY KEY,
    -- Auto generated unique id.
    title           VARCHAR(70)     NOT NULL,
    logo            BLOB,
     -- TODO: decide how to store images
    address         VARCHAR(255),
    phone_number    VARCHAR(15),
    email           VARCHAR(255),
    facebook_link   VARCHAR(75),
    -- (https://www.facebook.com/ = 25 char) + (Max username = 50 chars)
    -- https://www.facebook.com/NUIGArcheryClub/
    twitter_link    VARCHAR(50),
    -- (https://mobile.twitter.com/ = 27 chars) + (Max username = 15 chars) = 42
    -- https://mobile.twitter.com/nuigarcheryclub
    website_link    TEXT
);
DROP TABLE IF EXISTS ar_user;
CREATE TABLE ar_user (
    uuid                BINARY(16)     PRIMARY KEY,         -- Auto generated unique id.
    username            VARCHAR(50)    NOT NULL UNIQUE,     -- Unique username for each user of the system.
    picture_url         TEXT,                               -- TBD how to best store images.
    dob                 DATE           NOT NULL,            -- Date of birth of the archer.
    first_name          VARCHAR(35)    NOT NULL,            -- User's first name.
    last_name           VARCHAR(35)    NOT NULL,            -- User's last name.
    nickname            VARCHAR(35),                        -- Optional nickname for the archer.
    gender              TINYINT UNSIGNED       NOT NULL,
    -- The archer's gender.
	-- Male, female.
    level               TINYINT UNSIGNED,
    -- The archer's level.
	-- Beginner, intermediate, advanced, senior, etc.
    email               VARCHAR(255)           NOT NULL,
    -- Email of the archer.
	-- archer@gmail.com
    phone_no            VARCHAR(15),
    -- The phone number of the archer. Format TBD.
	-- +353123456789
    account_type        TINYINT UNSIGNED       NOT NULL,
    -- This will be used to identify the subscription plan selectd by the customer.
	-- Free, premium, club, etc.
    facebook_id         BIGINT,                         -- Format TBD based on Facebook's API.
    google_id           BIGINT,                         -- Format TBD based on Google's API.
    password_hash       VARCHAR(128),
	-- The hash of the user's password. Can only be null if the user uses social sign in.
    password_reset_code        CHAR(12)
	-- The temporary code that is used to link an account to the password reset page. Format TBD.
);
DROP TABLE IF EXISTS ar_session;
CREATE TABLE ar_session (
    uuid                    BINARY(16)      PRIMARY KEY,        -- Auto generated unique id.
    user_id                 BINARY(16)      NOT NULL,           -- The id of the user with which is session is associated.
    date                    DATE            NOT NULL,           -- The date when the session took place.
    start_time              TIME,                               -- The time that the session started. Format TBD.
    arrow_count             SMALLINT,
    -- The total number of arrows shot during the session
    -- 72
    location                VARCHAR(255),
    -- The location where the session took place.
    -- UL, Nemo Rangers Clubhouse, Kingfisher.
    type                    TINYINT UNSIGNED            NOT NULL,
    -- The type of session that this was.
    -- Training, competition.
    session_category        TINYINT UNSIGNED            NOT NULL,
    -- The category that this session could be clasified as.
    -- Outdoor, indoor, field.
    distance                TINYINT UNSIGNED            NOT NULL DEFAULT 18,
    -- The distance between the shooting line and the target for this session.
    -- 18, 30, 70.
    target_face_type        VARCHAR(15)                 NOT NULL,
    -- String(15)
    -- 40cm, 3 spot.
    notes                   TEXT,
    -- Notes related to the session.
    -- Lack of sleep. Sore bow arm. Remember to keep bow arm up after shots.
    bow_category            TINYINT UNSIGNED            NOT NULL,
    -- Barebow, recurve, compound.
    identifier              VARCHAR(20),
    -- Used to identify sessions by the user when the multiple sessions exist on the same day and starting tims are not entered.
    -- Early, late, morning, afternoon, evening.
    CONSTRAINT FK_session_user_id FOREIGN KEY (user_id) REFERENCES ar_user(uuid)
);
DROP TABLE IF EXISTS ar_season;
CREATE TABLE ar_season (
-- A season is a uniquely identifiable time range.
-- It can be created by either an individual or a club and only the owner (archer or club) can use it.
-- It is used to group sessions within it's start and end dates for display and comparison purposes.
    uuid                BINARY(16)          PRIMARY KEY,
    -- Auto generated unique id.
    identifier          VARCHAR(35),
    -- The text that allows users identify this specfic season in a list of seasons.
    start_date          DATE                NOT NULL,
    -- The date when the season started.
    end_date            DATE                NOT NULL,
    -- The date when the season ended.
    archer_id           BINARY(16),
    -- The archer that created this season. Each season must be owned by either an archer or a club.
    club_id             BINARY(16),
    -- The club that created this season. Each season must be owned by either an archer or a club.
    CONSTRAINT FK_season_archer_id FOREIGN KEY (archer_id) REFERENCES ar_user(uuid),
    CONSTRAINT FK_season_club_id FOREIGN KEY (club_id) REFERENCES ar_club(uuid)
);
DROP TABLE IF EXISTS ar_end;
CREATE TABLE ar_end (
    uuid                BINARY(16)          PRIMARY KEY,
    -- Auto generated unique id.
    archer_id           BINARY(16),
    -- The archer that is recording scores.
    session_id          BINARY(16),
    -- The session that the user is recording scores for.
    end_number          TINYINT UNSIGNED,
    -- The end that the user is recording scores for.
    CONSTRAINT FK_end_archer_id FOREIGN KEY (archer_id) REFERENCES ar_user(uuid),
    CONSTRAINT FK_end_session_id FOREIGN KEY (session_id) REFERENCES ar_session(uuid)
);
DROP TABLE IF EXISTS ar_score;
CREATE TABLE ar_score (
    uuid                BINARY(16)          PRIMARY KEY,
    -- Auto generated unique id.
    end_id              BINARY(16),
    -- The end that during which this score was shot.
    timestamp           TIMESTAMP,
    -- The time when the score was recorded.
    CONSTRAINT FK_score_end_id FOREIGN KEY (end_id) REFERENCES ar_end(uuid)
);
DROP TABLE IF EXISTS ar_award;
CREATE TABLE ar_award (
    uuid                BINARY(16)          PRIMARY KEY,
    -- Auto generated unique id.
    type                TINYINT UNSIGNED    NOT NULL,
    -- The category of award.
    -- Medal, badge, achievement.
    award_text          TEXT,
     -- The description that should accompany the award.
     -- Third place in the beginner recurve category at University of Limerick.
    date_won            DATE,
    -- The date when the badge/medal was earned (i.e. date of the competition or of the score)
    date_awarded        DATE,
    -- The date when the badge was awarded to the archer by the club admin.
    archer_id           BINARY(16)          NOT NULL,   -- The archer that received the award.
    archer_club_id      BINARY(16),
    -- The club that the archer was a part of at the time. This will allow filtering of awards by club.
    awarded_by          VARCHAR(70),
    -- The club that awarded the award to the archer.
    -- UL Archery Club
    CONSTRAINT FK_award_archer_id FOREIGN KEY (archer_id) REFERENCES ar_user(uuid),
    CONSTRAINT FK_award_archer_club_id FOREIGN KEY (archer_club_id) REFERENCES ar_club(uuid)
);
DROP TABLE IF EXISTS ar_club_admin;
CREATE TABLE ar_club_admin (
    club_id         BINARY(16),
    admin_id        BINARY(16),
    PRIMARY KEY (club_id, admin_id),
    CONSTRAINT FK_club_admin_club_id FOREIGN KEY (club_id) REFERENCES ar_club(uuid),
    CONSTRAINT FK_club_admin_admin_id FOREIGN KEY (admin_id) REFERENCES ar_user(uuid)
);
DROP TABLE IF EXISTS ar_club_coach;
CREATE TABLE ar_club_coach (
    club_id         BINARY(16),
    coach_id        BINARY(16),
    PRIMARY KEY (club_id, coach_id),
    CONSTRAINT FK_club_coach_club_id FOREIGN KEY (club_id) REFERENCES ar_club(uuid),
    CONSTRAINT FK_club_coach_coach_id FOREIGN KEY (coach_id) REFERENCES ar_user(uuid)
);
DROP TABLE IF EXISTS ar_club_archer;
CREATE TABLE ar_club_archer (
    club_id         BINARY(16),
    archer_id       BINARY(16),
    PRIMARY KEY (club_id, archer_id),
    CONSTRAINT FK_club_archer_club_id FOREIGN KEY (club_id) REFERENCES ar_club(uuid),
    CONSTRAINT FK_club_archer_archer_id FOREIGN KEY (archer_id) REFERENCES ar_user(uuid)
);
