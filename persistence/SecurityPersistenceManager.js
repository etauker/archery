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

        this.poolConnectionObject = {
            host     : this.host,
            user     : this.user,
            password : this.password,
            database : this.database,
            connectionLimit : 10
            // connectTimeout: 1000000
        };
        // this.connection = mysql.createConnection( this.connectionObject );
        this.pool = mysql.createPool( this.poolConnectionObject );
        console.log(this.poolConnectionObject);
        // Ensure that all mandatory parameters have a value
        if (!this.user) this._missingParameter("user");
        if (!this.password) this._missingParameter("password");
        if (!this.database) this._missingParameter("database");

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
    this._query(sQuery).then(res => {
        console.log("--- THEN ---");
        console.log(res);
    //     return this._close();
    // }).then(res => {
    //     console.log("--- Connection Closed ---");
    //     console.log(res);
    //     return res;
    }).catch( err => {
        console.log("--- CATCH ---");
        console.error(err);
    } );
};
SecurityPersistenceManager.prototype._query = function(sQuery, aParams) {

    // var counter = 0;
    //
    // var complete = false;
    // var promise;


    // console.log(sQuery);
    // try {
    // return new Promise((resolve, reject) => {
    //     try {
    //         this.connection.query(sQuery, (aParams || []), (error, results, fields) => {
    //             // console.log("after query");
    //
    //             if (error) {
    //                 console.log(error);
    //                 reject(error);
    //             } else {
    //                 console.log(results);
    //                 console.log(fields);
    //                 resolve(results, fields);
    //             }
    //         });
    //     } catch (err) {
    //         console.log("catch");
    //         reject(err);
    //     }
    //     // console.log(promise);
    // });

    // ================================================================
    // console.log("--- CONNECTION PARAMETERS ---");
    // console.log(this.connectionObject);
    // console.log("--- QUERY ---");
    // console.log(sQuery);
    // console.log("--- QUERY PARAMETERS ---");
    // console.log(aParams);
    //
    // mysql.createConnection(this.connectionObject)
    // .then((oCon) => {
    //     console.log("--- CONNECTION OBJECT ---");
    //     console.log(oCon.query(sQuery, (aParams || [])));
    //     return oCon.query(sQuery, (aParams || []));
    // })
    // .then((oResult) => {
    //     console.log("--- QUERY RESULT ---");
    //     console.log(oResult);
    //     // oCon.end();
    //     // resolve(result);
    // })
    // .catch(function(oError) {
    //     console.error(oError);
    // });
    // ================================================================
    return new Promise( ( resolve, reject ) => {
        if (typeof this.pool.query === 'function' ) {
            // console.log("--- IF ---");
            this.pool.query( sQuery, aParams, ( err, rows ) => {
                console.log("--- QUERY COMPLETE ---");
                // this.connection.destroy();
                if ( err )
                return reject( err );
                resolve( rows );
            } );
        } else {
            console.log("--- ELSE ---");
            // this.connection = mysql.createConnection( this.connectionObject );
            // this.connection.query( sQuery, aParams, ( err, rows ) => {
            //     if ( err )
            //     return reject( err );
            //     resolve( rows );
            // } );
        }
    } );
    //, (error) => {
    //     console.log("--- QUERY ERROR ---");
    //     console.error(error);
    // });
    //     console.log("--- RESULT ---");
    //     console.log(result);
    //     return result;
    // res.then(result => console.log(result));

        //, (error, results, fields) => {
        //     // console.log("after query");
        //
        //     if (error) {
        //         console.log(error);
        //         reject(error);
        //     } else {
        //         console.log(results);
        //         console.log(fields);
        //         resolve(results, fields);
        //     }
        // });
    // });
};

SecurityPersistenceManager.prototype._close = function(sQuery, aParams) {
    // return new Promise( ( resolve, reject ) => {
        console.log("--- Closing Connection ---");
    //     // console.log(this.connection.end.toString());
    //     this.connection.end(err => {
    //         console.log(err);
    //         if ( err )
    //             return reject( err );
    //         resolve(true);
    //     } );
    // } );
}

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
