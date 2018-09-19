var SecurityPersistenceManager = require("../../persistence/SecurityPersistenceManager.js");
// var oConfig = {};
// var oManager = {};
//
//
//
// oConfig = {
//     host: "test host",
//     user: "test user",
//     password: "test password",
//     database: "test database"
// };
oManager = new SecurityPersistenceManager({
    host: "localhost",
    user: "securityAdmin",
    password: "securityAdmin",
    database: "etauker_security"
});
//
// oConfig = {SecurityPersistenceManagerTest
//     user: "test user",
//     password: "test password",
//     database: "test database"
// };
// oManager = new SecurityPersistenceManager(oConfig);
//
// oConfig = {
//     host: "test host",
//     password: "test password",
//     database: "test database"
// };
// oManager = new SecurityPersistenceManager(oConfig);
//
//
// oConfig = {
//     host: "test host",
//     user: "test user",
//     database: "test database"
// };
// oManager = new SecurityPersistenceManager(oConfig);
//
//
// oConfig = {
//     host: "test host",
//     user: "test user",
//     password: "test password"
// };
// oManager = new SecurityPersistenceManager(oConfig);


describe("SecurityPersistenceManager", function() {
    it("should retrieve a user with specified username", function() {

        oManager.getUser({
            uuid: "f024444f-b872-11e8-9406-080027d2c7dd"
        });//.then((oResult, oFields) => {
        //     console.log("oResult");
        //     // console.log(JSON.stringify(oResult));
        //     // console.log(oResult);
        //     // console.log(oFields);
        //
        //     expect(oResult).not.toBe(null);
        //     expect(oResult).not.toBe(undefined);
        //     expect(oResult.length).toBe(1);
        // }, (oError) => {
        //     // console.log("oError");
        //     // console.log(JSON.stringify(oError));
        //     console.log(oError);
        //     expect(oError).not.toBe(null)
        // }).catch(res => console.log("finally"));
    });
});
