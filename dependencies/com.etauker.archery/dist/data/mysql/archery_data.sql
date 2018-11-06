USE etauker_security;

INSERT INTO ROLE (name, description, created_by, updated_by)
VALUES
(
	"com.etauker.archery.Archer",
	"Club member who uses the system to record and track their own scores.",
	"SETUP_SCRIPT",
	"SETUP_SCRIPT"
),
(
	"com.etauker.archery.Admin",
	"Club member who manages the clubs information and registers new members on behalf of the club.",
	"SETUP_SCRIPT",
	"SETUP_SCRIPT"
),
(
	"com.etauker.archery.Coach",
	"Club member who can view the scores of any of the archers within the club they are currently assigned to.",
	"SETUP_SCRIPT",
	"SETUP_SCRIPT"
);

INSERT INTO USER (username, password_hash, created_by, updated_by)
VALUES
(
	"archer",
	"$argon2i$v=19$m=4096,t=3,p=1$+zZ38o8Ssj/r22TEl/y5aw$6XVZCf4tRQC2Ho3n/+DAW243G2pX9ZOgetCV/GGBtrQ",
	"SETUP_SCRIPT",
	"SETUP_SCRIPT"
),
(
	"admin",
	"$argon2i$v=19$m=4096,t=3,p=1$+zZ38o8Ssj/r22TEl/y5aw$6XVZCf4tRQC2Ho3n/+DAW243G2pX9ZOgetCV/GGBtrQ",
	"SETUP_SCRIPT",
	"SETUP_SCRIPT"
),
(
	"coach",
	"$argon2i$v=19$m=4096,t=3,p=1$+zZ38o8Ssj/r22TEl/y5aw$6XVZCf4tRQC2Ho3n/+DAW243G2pX9ZOgetCV/GGBtrQ",
	"SETUP_SCRIPT",
	"SETUP_SCRIPT"
);


INSERT INTO USER_ROLE (user_id, role_id)
VALUES
(
	(SELECT uuid FROM USER WHERE username = "archer"),
	(SELECT id FROM ROLE WHERE name = "com.etauker.archery.Archer")
),
(
	(SELECT uuid FROM USER WHERE username = "admin"),
	(SELECT id FROM ROLE WHERE name = "com.etauker.archery.Admin")
),
(
	(SELECT uuid FROM USER WHERE username = "coach"),
	(SELECT id FROM ROLE WHERE name = "com.etauker.archery.Coach")
);
