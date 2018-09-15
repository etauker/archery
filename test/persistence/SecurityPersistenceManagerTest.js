var SecurityPersistenceManager = require("../../persistence/SecurityPersistenceManager.js");
var oConfig = {};
var oManager = {};



oConfig = {
    host: "test host",
    user: "test user",
    password: "test password",
    database: "test database"
};
oManager = new SecurityPersistenceManager(oConfig);

oConfig = {
    user: "test user",
    password: "test password",
    database: "test database"
};
oManager = new SecurityPersistenceManager(oConfig);

oConfig = {
    host: "test host",
    password: "test password",
    database: "test database"
};
oManager = new SecurityPersistenceManager(oConfig);


oConfig = {
    host: "test host",
    user: "test user",
    database: "test database"
};
oManager = new SecurityPersistenceManager(oConfig);


oConfig = {
    host: "test host",
    user: "test user",
    password: "test password"
};
oManager = new SecurityPersistenceManager(oConfig);
