global.SecurityErrorGeneratorPath = process.cwd() + "/dependencies/com.etauker.security/utils/SecurityErrorGenerator.js";
global.SecurityParameterValidatorPath = process.cwd() + "/dependencies/com.etauker.security/utils/SecurityParameterValidator.js";
global.SecurityPasswordManagerPath = process.cwd() + "/dependencies/com.etauker.security/utils/SecurityPasswordManager.js";
global.SecurityPersistenceManagerPath = process.cwd() + "/dependencies/com.etauker.security/persistence/SecurityPersistenceManager.js";
global.SecurityTokenManagerPath = process.cwd() + "/dependencies/com.etauker.security/logic/SecurityTokenManager.js";
global.SecurityServicePath = process.cwd() + "/dependencies/com.etauker.security/service/SecurityService.js";


var SecurityPersistenceManager = require(SecurityPersistenceManagerPath);
oManager = new SecurityPersistenceManager({
    host: "localhost",
    user: "securityAdmin",
    password: "securityAdmin",
    database: "etauker_security",
    commit: false,
    debug: true
});

describe("SecurityPersistenceManager getUser function", function() {
    it("should retrieve a user with specified uuid", function() {
        oManager.getUser({
            uuid: "f024444f-b872-11e8-9406-080027d2c7dd"
        }).then((oResult, oFields) => {
            expect(oResult).not.toBe(null, "null was returned by getUser()");
            expect(oResult).not.toBe(undefined, "undefined was returned by getUser()");
            expect(oResult.length).toBe(1);
            expect(oResult[0].uuid).toBe("f024444f-b872-11e8-9406-080027d2c7dd");
            expect(oResult[0].username).toBe("admin");
            expect(oResult[0].created_by).toBe("SETUP_SCRIPT");
        }).catch(oError => {
            console.log(oError);
            fail("Error retrieving user from the database.");
        });
    });

//     it("should retrieve a user with specified username", function() {
//         oManager.getUser({
//             username: "admin"
//         }).then((oResult, oFields) => {
//             expect(oResult).not.toBe(null, "null was returned by getUser()");
//             expect(oResult).not.toBe(undefined, "undefined was returned by getUser()");
//             expect(oResult.length).toBe(1);
//             expect(oResult[0].uuid).toBe("f024444f-b872-11e8-9406-080027d2c7dd");
//             expect(oResult[0].username).toBe("admin");
//             expect(oResult[0].created_by).toBe("SETUP_SCRIPT");
//         }).catch(oError => {
//             console.log(oError);
//             fail("Error retrieving user from the database.");
//         });
//     });
//
//     it("should not retrieve a user with a non-exitent uuid", function() {
//         oManager.getUser({
//             uuid: "test-non-existent"
//         }).then((oResult, oFields) => {
//             expect(oResult).not.toBe(null, "null was returned by getUser()");
//             expect(oResult).not.toBe(undefined, "undefined was returned by getUser()");
//             expect(oResult.length).toBe(0);
//         }).catch(oError => {
//             console.log(oError);
//             fail("Error retrieving user from the database.");
//         });
//     });
//
//     it("should not retrieve a user with a non-exitent username", function() {
//         oManager.getUser({
//             username: "test-non-existent"
//         }).then((oResult, oFields) => {
//             expect(oResult).not.toBe(null, "null was returned by getUser()");
//             expect(oResult).not.toBe(undefined, "undefined was returned by getUser()");
//             expect(oResult.length).toBe(0);
//         }).catch(oError => {
//             console.log(oError);
//             fail("Error retrieving user from the database.");
//         });
//     });
// });
//
// describe("SecurityPersistenceManager getUserByUsername function", function() {
//     it("should retrieve a user with specified username", function() {
//         oManager.getUser({
//             username: "admin"
//         }).then((oResult, oFields) => {
//             expect(oResult).not.toBe(null, "null was returned by getUser()");
//             expect(oResult).not.toBe(undefined, "undefined was returned by getUser()");
//             expect(oResult.length).toBe(1);
//             expect(oResult[0].uuid).toBe("f024444f-b872-11e8-9406-080027d2c7dd");
//             expect(oResult[0].username).toBe("admin");
//             expect(oResult[0].created_by).toBe("SETUP_SCRIPT");
//         }).catch(oError => {
//             console.log(oError);
//             fail("Error retrieving user from the database.");
//         });
//     });
//
//     it("should not retrieve a user with a non-exitent username", function() {
//         oManager.getUser({
//             username: "test-non-existent"
//         }).then((oResult, oFields) => {
//             expect(oResult).not.toBe(null, "null was returned by getUser()");
//             expect(oResult).not.toBe(undefined, "undefined was returned by getUser()");
//             expect(oResult.length).toBe(0);
//         }).catch(oError => {
//             console.log(oError);
//             fail("Error retrieving user from the database.");
//         });
//     });
});

describe("SecurityPersistenceManager getRolesByUser function", function() {
    // it("should retrieve roles for a user with specified uuid", function() {
    //     oManager.getRolesByUser({
    //         uuid: "f0244364-b872-11e8-9406-080027d2c7dd"
    //     }).then((oResult, oFields) => {
    //         expect(oResult).not.toBe(null, "null was returned by getRolesByUser()");
    //         expect(oResult).not.toBe(undefined, "undefined was returned by getRolesByUser()");
    //         expect(oResult.length).toBe(1);
    //         expect(oResult[0].id).toBe("f023614e-b872-11e8-9406-080027d2c7dd");
    //         expect(oResult[0].name).toBe("com.etauker.archery.Archer");
    //         expect(oResult[0].created_by).toBe("SETUP_SCRIPT");
    //     }).catch(oError => {
    //         console.log(oError);
    //         fail("Error retrieving user from the database.");
    //     });
    // });
    //
    // it("should retrieve roles for a user with specified username", function() {
    //     oManager.getRolesByUser({
    //         username: "archer"
    //     }).then((oResult, oFields) => {
    //         expect(oResult).not.toBe(null, "null was returned by getRolesByUser()");
    //         expect(oResult).not.toBe(undefined, "undefined was returned by getRolesByUser()");
    //         expect(oResult.length).toBe(1);
    //         expect(oResult[0].id).toBe("f023614e-b872-11e8-9406-080027d2c7dd");
    //         expect(oResult[0].name).toBe("com.etauker.archery.Archer");
    //         expect(oResult[0].created_by).toBe("SETUP_SCRIPT");
    //     }).catch(oError => {
    //         console.log(oError);
    //         fail("Error retrieving user from the database.");
    //     });
    // });
    //
    // it("should not retrieve a user with a non-exitent uuid", function() {
    //     oManager.getRolesByUser({
    //         uuid: "test-non-existent"
    //     }).then((oResult, oFields) => {
    //         expect(oResult).not.toBe(null, "null was returned by getRolesByUser()");
    //         expect(oResult).not.toBe(undefined, "undefined was returned by getRolesByUser()");
    //         expect(oResult.length).toBe(0);
    //     }).catch(oError => {
    //         console.log(oError);
    //         fail("Error retrieving user from the database.");
    //     });
    // });
    //
    // it("should not retrieve a user with a non-exitent username", function() {
    //     oManager.getRolesByUser({
    //         username: "test-non-existent"
    //     }).then((oResult, oFields) => {
    //         expect(oResult).not.toBe(null, "null was returned by getRolesByUser()");
    //         expect(oResult).not.toBe(undefined, "undefined was returned by getRolesByUser()");
    //         expect(oResult.length).toBe(0);
    //     }).catch(oError => {
    //         console.log(oError);
    //         fail("Error retrieving user from the database.");
    //     });
    // });
});

describe("SecurityPersistenceManager createUser function", function() {
    // it("should create user with correct details", fnDone => {
    //     oManager.createUser({
    //         username: "test"
    //     }, "password").then((oResult, oFields) => {
    //         expect(oResult).not.toBe(null, "null was returned by createUser()");
    //         expect(oResult).not.toBe(undefined, "undefined was returned by createUser()");
    //         expect(oResult.affectedRows).toBe(1);
    //         fnDone();
    //     }).catch(oError => {
    //         console.log(oError);
    //         fail("Error saving user in the database.");
    //     });
    // });
    // it("should not create user without a password provided", fnDone => {
    //     oManager.createUser({
    //         username: "test"
    //     }).then((oResult, oFields) => {
    //         fail("Error should have been thrown.");
    //     }).catch(oError => {
    //         fnDone();
    //     });
    // });
    // it("should not create user without a user provided", fnDone => {
    //     oManager.createUser(null, "password").then((oResult, oFields) => {
    //         console.log("------------------------------------");
    //         console.log(oResult);
    //         console.log("------------------------------------");
    //         fail("Error should have been thrown.");
    //     }).catch(oError => {
    //         console.log("------------------------------------");
    //         console.log(oError);
    //         console.log("------------------------------------");
    //         fnDone();
    //     });
    // });
    // it("should not create user with an empty user provided", fnDone => {
    //     oManager.createUser({}, "password").then((oResult, oFields) => {
    //         fail("Error should have been thrown.");
    //     }).catch(oError => {
    //         fnDone();
    //     });
    // });
});
