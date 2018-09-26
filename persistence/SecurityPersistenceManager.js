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
        // let oDatabase = process.env ? (process.env["com.etauker.security.db"] || {}) : {};
        this.host = oParams.host || process.env.COM_ETAUKER_SECURITY_DB_HOST || 'localhost';
        this.user = oParams.user || process.env.COM_ETAUKER_SECURITY_DB_USER;
        this.password = oParams.password || process.env.COM_ETAUKER_SECURITY_DB_PASSWORD;
        this.database = oParams.database || process.env.COM_ETAUKER_SECURITY_DB_DATABASE;
        this.commit = oParams.commit === false ? false : true;
        this.debug = oParams.debug === true ? true : false;

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
/**
 *  Retrieves a user from the database.
 *  The properties names of the provided object must match the database columns.
 *  The values of those properties are the values that will be searched in the database.
 *
 *  @param {object} oUser - The object representing the user to be retrieved from the database.
 *  @return {promise} Resolves to the user entry from the database.
 */
SecurityPersistenceManager.prototype.getUser = function(oUser) {
    var sQuery = this._formSelectQuery("USER", oUser)
    return this._query(sQuery).then(aQueryResult => {
        return aQueryResult[0];
    });
};
/**
 *  Retrieves a user from the database.
 *
 *  @param {string} sUser - The username of the user to retrieve from the database.
 *  @return {promise} Resolves to the user entry from the database.
 */
SecurityPersistenceManager.prototype.getUserByUsername = function(sUsername) {
    return this.getUser({
        username: sUsername
    });
};
/**
 *  Retrieves the roles for a given user.
 *  The provided user object must contain either a uuid or a username field.
 *  If a uuid field is provided for the user it will be used to retrieve the roles.
 *
 *  @param {object} oUser - The object representing the user who's roles should be retrieved from the database.
 *  @param {string=} oUser.uuid - The UUID of the user for which to retrieve the roles.
 *  @param {string=} oUser.username - The username of the user for which to retrieve the roles. Only used if the UUID is not provided.
 *  @return {promise} Resolves to the array of user roles.
 */
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
/**
 *  Creates a database entry for the given user object.
 *  The password must be provided separately and will be hashed before it is persisted.

 *  @param {object} oUser - The object representing the user that should be saved in the database.
 *  @param {string} sPassword - Plain-text password of the user. This function handles the hashing of this password before saving.
 *  @return {promise} Resolves to the database response object for the transaction.
 */
SecurityPersistenceManager.prototype.createUser = function(oUser, sPassword) {

    return argon2.hash(sPassword).then(sHash => {
        if (!oUser) throw new Error("Hashing of the provided password failed - user parameter missing.");
        if (!sPassword) throw new Error("Hashing of the provided password failed - password parameter missing.");

        oUser.password_hash = sHash;
        var sQuery = this._formInsertQuery("USER", [oUser], Object.keys(oUser))
        return this._query(sQuery).then(oQueryResult => {
            return oQueryResult;
        })
    }).catch(oError => {
        if (!oUser) throw new Error("Hashing of the provided password failed - user parameter missing.");
        if (!sPassword) throw new Error("Hashing of the provided password failed - password parameter missing.");
        throw new Error("Hashing of the provided password failed - " + oError.toString());
    });
};
SecurityPersistenceManager.prototype.createRole = function(oRole) {
    // TODO: Creates a database entry corresponding to the provided object
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
// Creates a database entry corresponding to the provided object
SecurityPersistenceManager.prototype.saveSession = function(sToken, oDecodedToken, oConfig) {

    var oSession = {
        jwt: sToken,
        jwt_algorithm: oConfig.algorithm,
        user_id: oDecodedToken.sub,
        original_exp: {
            type: "timestamp",
            value: oDecodedToken.exp
        },
        original_iat: {
            type: "timestamp",
            value: oDecodedToken.iat
        }
    };

    var sQuery = this._formInsertQuery("SESSION", [oSession], Object.keys(oSession))
    console.log(sQuery);
    return this._query(sQuery).then(oQueryResult => {
        return oQueryResult;
    });
};
SecurityPersistenceManager.prototype.extendSession = function(oExtension) {
    // TODO: Creates a database entry corresponding to the provided object
};


//===========================================
//             PRIVATE FUNCTIONS
//===========================================

/**
 *  Generates a SELECT statement from the given object.
 *  Assumes that all properties of the object correspond to the database columns.
 *  Also assumes that the database entry has information identical to the provided property values.

 *  @param {string} sTable - The name of the database table which will be queried.
 *  @param {object} oEntity - The object containing the filter criteria.
 *  @return {string} The query to be excuted in the database.
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

/**
 *  Generates an INSERT statement from the given object.
 *  Assumes that all properties of the object correspond to the database columns.
 *  Also assumes that the database entry should contain the information provided in the property values.
 *
 *  @param {string} sTable - The name of the database table to which the information will be inserted.
 *  @param {object[]} aEntities - an array of entities to be inserted into the database
 *  @param {string[]=} aFields - The names of the database columns that should be inserted into. If not provided, the property keys of aEntities will be used.
 *  @return {string} The insert statement to be excuted in the database.
 */
SecurityPersistenceManager.prototype._formInsertQuery = function(sTable, aEntities, aFields) {
    var sQuery = `INSERT INTO ${this.database}.${sTable} (`;
    sQuery += aFields.join(", ") + ") VALUES ";

    // Loop through all properties of the object and format as 'KEY = "value"'
    aEntities = aEntities.map(oObject => {
        var aProperties = Object.keys(oObject).map(sKey => {

            // Special case for converting unix timestamp to datetime
            if (typeof oObject[sKey] === "object" && oObject[sKey].type === "timestamp") {
                return "(SELECT FROM_UNIXTIME("+oObject[sKey].value+"))";
            }

            return `"${oObject[sKey]}"`;
        })
        return "(" + aProperties.join(", ") + ")";
    });
    sQuery += aEntities.join(", ") + ";";
    return sQuery;
};

/**
 *  Executes the provided query in the database.
 *
 *  @param {string} sQuery - The query to be executed in the database.
 *  @param {any[]=} aParams - An array of values to replace the placeholders in the query.
 *  @return {promise} The insert statement to be excuted in the database.
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

/**
 *  Throws an error containing a message that a required parameter is missing.
 *
 *  @param {string} sParameter - The name of the required parameter that could not be accessed from the constructor.
 *  @throws An error describing what parameter is missing and how to supply it.
 */
SecurityPersistenceManager.prototype._missingParameter = function(sParameter) {
throw Error(`---
Missing ${sParameter} parameter in the constructor of SecurityPersistenceManager.
Ensure that process.env.com.etauker.security.db.${sParameter} is set or the parameter is otherwise provided.
---`);
}

module.exports = SecurityPersistenceManager;
