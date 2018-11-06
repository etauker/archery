USE etauker_security;

INSERT INTO ROLE (name, description, created_by, updated_by)
VALUES
(
	"com.etauker.glucose.Diabetic",
	"Diabetic who wishes to keep track of their blood glucose readings, insulin units and consumed carbohydrates.",
	"SETUP_SCRIPT",
	"SETUP_SCRIPT"
);

INSERT INTO USER (username, password_hash, created_by, updated_by)
VALUES
(
	"diabetic",
	"$argon2i$v=19$m=4096,t=3,p=1$+zZ38o8Ssj/r22TEl/y5aw$6XVZCf4tRQC2Ho3n/+DAW243G2pX9ZOgetCV/GGBtrQ",
	"SETUP_SCRIPT",
	"SETUP_SCRIPT"
);

INSERT INTO USER_ROLE (user_id, role_id)
VALUES
(
	(SELECT uuid FROM USER WHERE username = "diabetic"),
	(SELECT id FROM ROLE WHERE name = "com.etauker.glucose.Diabetic")
);
