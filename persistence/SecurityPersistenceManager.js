/**
*   Loads and saves data related to security.
*/

var mysql = require('mysql');
const util = require('util');
const argon2 = require('argon2');
class SecurityPersistenceManager {

    constructor(oParams) {

        // Set class variables
        oParams = oParams || {};
        let oDatabase = process.env ? (process.env["com.etauker.security.db"] || {}) : {};
        this.host = oParams.host || oDatabase.host || 'localhost';
        this.user = oParams.user || oDatabase.user;
        this.password = oParams.password || oDatabase.password;
        this.database = oParams.database || oDatabase.database;
        this.commit = oParams.commit === false ? false : true;

        // Create the connection pool
        this.pool = mysql.createPool( {
            host     : this.host,
            user     : this.user,
            password : this.password,
            database : this.database,
            connectionLimit : 10
        } );

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
    var sQuery = this._formSelectQuery("USER", oUser)
    return this._query(sQuery).then(oQueryResult => {
        return oQueryResult;
    });
};

SecurityPersistenceManager.prototype.getRolesByUser = function(oUser) {

    // Format the query
    var sQuery = `SELECT * FROM etauker_security.ROLE WHERE id IN (SELECT role_id FROM etauker_security.USER_ROLE `;
    if (oUser.uuid) {
        sQuery += `WHERE user_id = "${oUser.uuid}"`;
    } else if (oUser.username) {
        sQuery += `WHERE user_id = (SELECT uuid FROM USER WHERE username = "${oUser.username}" LIMIT 1)`;
    }
    sQuery += ");";

    // Execute the query
    return this._query(sQuery).then(oQueryResult => {
        return oQueryResult;
    });
};
SecurityPersistenceManager.prototype.createRole = function(oRole) {
    // TODO: Creates a database entry corresponding to the provided object
};
SecurityPersistenceManager.prototype.createUser = function(oUser, sPassword) {
    return argon2.hash(sPassword).then(sHash => {
        oUser.password_hash = sHash;
        var sQuery = this._formInsertQuery("USER", Object.keys(oUser), [oUser])
        return this._query(sQuery).then(oQueryResult => {
            return oQueryResult;
        })
    });
};
SecurityPersistenceManager.prototype.updateRole = function(oRole) {
    // TODO: Updates a database entry corresponding to the provided object
};
SecurityPersistenceManager.prototype.updateUser = function(oUser) {
    // TODO: Updates a database entry corresponding to the provided object
    // NOTE: The password must be hashed here before saving
};
SecurityPersistenceManager.prototype.deleteRole = function(sRoleId) {
    // TODO: Deletes a database entry corresponding to the provided object
};
SecurityPersistenceManager.prototype.deleteUser = function(sUserId) {
    // TODO: Deletes a database entry corresponding to the provided object
};
SecurityPersistenceManager.prototype.assignUserRole = function(sUserId, sRoleId) {
    // TODO: Assigns the give role to the given user
};
SecurityPersistenceManager.prototype.unassignUserRole = function(sUserId, sRoleId) {
    // TODO: Deletes the user role corresponding to the given parameters
};
SecurityPersistenceManager.prototype.saveSession = function(oSession) {
    // TODO: Creates a database entry corresponding to the provided object
};
SecurityPersistenceManager.prototype.extendSession = function(oExtension) {
    // TODO: Creates a database entry corresponding to the provided object
};


//===========================================
//             PRIVATE FUNCTIONS
//===========================================

/**
 * Iterates over an object and adds a WHERE clause for each property.
 */
SecurityPersistenceManager.prototype._formSelectQuery = function(sTable, oEntity) {
    var sQuery = `SELECT * FROM ${this.database}.${sTable} WHERE `;

    // Loop through all properties of the object and format as 'KEY = "value"'
    var aProperties = Object.keys(oEntity).map(sKey => {
        return `${sKey} = "${oEntity[sKey]}"`;
    })

    // Join the individual lines with AND and add semicolon at the end
    sQuery += aProperties.join(" AND ") + ";";
    return sQuery;
};
SecurityPersistenceManager.prototype._formInsertQuery = function(sTable, aFields, aObjects) {
    var sQuery = `INSERT INTO ${this.database}.${sTable} (`;
    sQuery += aFields.join(", ") + ") VALUES ";

    // Loop through all properties of the object and format as 'KEY = "value"'
    aObjects = aObjects.map(oObject => {
        var aProperties = Object.keys(oObject).map(sKey => {
            return `"${oObject[sKey]}"`;
        })
        return "(" + aProperties.join(", ") + ")";
    });
    sQuery += aObjects.join(", ") + ";";
    return sQuery;
};
SecurityPersistenceManager.prototype._formIdQuery = function(sTable, oEntity) {
    var sField = sTable === "USER" ? "uuid" : "id";
    var sQuery = `SELECT ${sField} FROM ${this.database}.${sTable} WHERE `;

    // Loop through all properties of the object and format as 'KEY = "value"'
    var aProperties = Object.keys(oEntity).map(sKey => {
        return `${sKey} = "${oEntity[sKey]}"`;
    })

    // Join the individual lines with AND and add semicolon at the end
    sQuery += aProperties.join(" AND ") + ";";
    return sQuery;
};

/**
 * Executes the provided query and returns a promise.
 */
SecurityPersistenceManager.prototype._query = function(sQuery, aParams) {
    return new Promise((fnResolve, fnReject) => {

        // Guard for non-exitent connection pool
        if (typeof this.pool.query !== 'function') {
            console.log("Database connection pool issue occured. Pool likely does not exist.");
            return;
        }

        this.pool.getConnection(function(oError, oConnection) {
            if (oError) throw oError;

            oConnection.beginTransaction(function(oError) {
                if (oError) throw oError;

                oConnection.query(sQuery, function (oError, aRows, fields) {

                    // Error while querying the database
                    if (oError) {
                        oConnection.rollback(() => fnReject(oError));
                    }

                    // Commit the query
                    if (this.commit) {
                        oConnection.commit((oError) => {
                            oConnection.release();
                            if (oError) { fnReject(oError); }
                            else {
                                fnResolve(aRows);
                            }
                        });
                    }
                    // Rollback the query
                    else {
                        oConnection.rollback(() => {
                            oConnection.release();
                            fnResolve(aRows);
                        });
                    }
                });
            });
        });
    });
};

SecurityPersistenceManager.prototype._missingParameter = function(sParameter) {
throw Error(`
---
Missing ${sParameter} parameter in the constructor of SecurityPersistenceManager.
Ensure that process.env.com.etauker.security.db.${sParameter} is set or the parameter is otherwise provided.
---
`);
}

module.exports = SecurityPersistenceManager;
