/**
*   Loads and saves data related to security.
*/

var mysql = require('mysql');
// var mysql = require('promise-mysql');
const util = require('util');
class SecurityPersistenceManager {

    constructor(oParams) {
        // Set class variables
        oParams = oParams || {};
        let oDatabase = process.env ? (process.env["com.etauker.security.db"] || {}) : {};
        this.host = oParams.host || oDatabase.host || 'localhost';
        this.user = oParams.user || oDatabase.user;
        this.password = oParams.password || oDatabase.password;
        this.database = oParams.database || oDatabase.database;

        // Ensure that all mandatory parameters have a value
        if (!this.user) this._missingParameter("user");
        if (!this.password) this._missingParameter("password");
        if (!this.database) this._missingParameter("database");
        this.state = "progress";
        this.connection = mysql.createConnection({
            host     : this.host,
            user     : this.user,
            password : this.password,
            database : this.database
        });
    }
}

//===========================================
//             PUBLIC FUNCTIONS
//===========================================
SecurityPersistenceManager.prototype.getUser = function(oUser) {
    var sQuery = `SELECT * FROM ${this.database}.USER WHERE `;//uuid = "f02472-11e8-9406-080027d2c7dd";';
    var aProperties = Object.keys(oUser).map(sKey => {
        return `${sKey} = "${oUser[sKey]}"`;
    })
    sQuery += aProperties.join(" AND ") + ";";

    return this._query(sQuery);




    // var promise =
    // this.connection.query(sQuery, function (error, results, fields) {
    //     console.log("after query");
    //
    //     return new Promise((resolve, reject) => {
    //         if (error) {
    //             console.log("error");
    //             reject(error);
    //         } else {
    //             console.log("success");
    //             resolve(results, fields);
    //         }
    //     });
    // });

};
SecurityPersistenceManager.prototype._query = function(sQuery, aParams) {

    // var interval = 1000;
    var counter = 0;
    // var max = 10000;

    var complete = false;
    var promise;
    //
    // var timeout = setInterval(console.log("Hello"), 10);
    // this.connection.query[util.promisify.custom] = (sQuery, aParams) => {
    //     return new Promise((resolve, reject) => {
    //         // doSomething(foo, resolve, reject);
    //         this.connection.query(sQuery, (aParams || []), (error, results, fields) => {
    //             if (error) {
    //                 console.log("error");
    //                 reject(error);
    //             } else {
    //                 console.log("success");
    //                 resolve(results, fields);
    //             }
    //         });
    //     });
    // };
    // var con = this.connection;
    // console.log(con);

    // var oConnection = this.connection.then(());
    // const promisified = util.promisify(oConnection.query);
    // return promisified(sQuery, (aParams || []));
    // var prom = promisified(sQuery, (aParams || []));
    // prom.then((result) => {
    //     console.log(result);
    // }, (error) => {
    //     console.log(error);
    // })







    // console.log(this.state);
    // // setTimeout(function(args) {
    //
    // do {
    //     console.log(this.state);
    // }
    // while (this.state !== "complete")
    //
    // console.log(this.state);
    // var prom = this.connection.query(sQuery, (aParams || []));
    // prom.then((result) => {
    //     console.log(result);
    // }, (error) => {
    //     console.log(error);
    // })
    // // }, 10000);





    // console.log(this.connection.query.toString());

    console.log(sQuery);
    // try {
    return new Promise((resolve, reject) => {
        this.connection.query(sQuery, (aParams || []), (error, results, fields) => {
            console.log("after query");

                if (error) {
                    console.log("error");
                    reject(error);
                } else {
                    console.log("success");
                    // console.log(results);
                    // console.log(fields);
                    resolve(results, fields);
                }
            });
            complete = true;
            console.log(complete);
            console.log(promise);
        });

    // } catch (err) {
    //     // console.log("err");
    //     // console.log(err);
    // }
// console.log(complete);
//     while (!complete) {
//         counter++;
//         // console.log(counter);
//     }
//     // console.log(promise);
//
//     if (complete) {
//         console.log("complete");
//         return promise;
//     } else {
//         console.log("Database query timed out");
//         return new Promise().reject("Database query timed out");
//     }






    // setInterval(function() {
    //     console.log("inside set interval");
    //     } else if (counter <= max) {
    //         console.log("} else if (counter <= max) {");
    //         counter += interval;
    // }, interval);

};

SecurityPersistenceManager.prototype.getRolesByUser = function(sUserId) {
    // TODO: Return an array of rolescorresponding to the provided user
}
SecurityPersistenceManager.prototype.createRole = function(oRole) {
    // TODO: Creates a database entry corresponding to the provided object
}
SecurityPersistenceManager.prototype.createUser = function(oUser) {
    // TODO: Creates a database entry corresponding to the provided object
    // NOTE: The password must be hashed here before saving
}
SecurityPersistenceManager.prototype.updateRole = function(oRole) {
    // TODO: Updates a database entry corresponding to the provided object
}
SecurityPersistenceManager.prototype.updateUser = function(oUser) {
    // TODO: Updates a database entry corresponding to the provided object
    // NOTE: The password must be hashed here before saving
}
SecurityPersistenceManager.prototype.deleteRole = function(sRoleId) {
    // TODO: Deletes a database entry corresponding to the provided object
}
SecurityPersistenceManager.prototype.deleteUser = function(sUserId) {
    // TODO: Deletes a database entry corresponding to the provided object
}
SecurityPersistenceManager.prototype.assignUserRole = function(sUserId, sRoleId) {
    // TODO: Assigns the give role to the given user
}
SecurityPersistenceManager.prototype.unassignUserRole = function(sUserId, sRoleId) {
    // TODO: Deletes the user role corresponding to the given parameters
}
SecurityPersistenceManager.prototype.saveSession = function(oSession) {
    // TODO: Creates a database entry corresponding to the provided object
}
SecurityPersistenceManager.prototype.extendSession = function(oExtension) {
    // TODO: Creates a database entry corresponding to the provided object
}

//===========================================
//             PRIVATE FUNCTIONS
//===========================================
SecurityPersistenceManager.prototype._missingParameter = function(sParameter) {
throw Error(`
---
Missing ${sParameter} parameter in the constructor of SecurityPersistenceManager.
Ensure that process.env.com.etauker.security.db.${sParameter} is set or the parameter is otherwise provided.
---
`);
}

module.exports = SecurityPersistenceManager;
