const mysql = require('mysql');
const ErrorGenerator = require(ArcheryErrorGeneratorPath);
// const SecurityPasswordManager = require(SecurityPasswordManagerPath);

class ArcheryPersistenceManager {

    constructor(oParams) {

        // Objects
        this.error = new ErrorGenerator(
            "com.etauker.archery",
            "persistence",
            "ArcheryPersistenceManager",
            [
                { code: 1, http: 500, message: "Missing parameters" },
                { code: 2, http: 500, message: "Database connection pool issue occured." },
                { code: 3, http: 500, message: "Error getting database connection." },
                { code: 4, http: 500, message: "Error starting a transaction." },
                { code: 5, http: 500, message: "Error querying the database." },
                { code: 6, http: 500, message: "Error committing query to the database." },
                { code: 7, http: 500, message: "Unexpected number of results." }
            ]
        );

        // Set class variables
        oParams = oParams || {};
        this.host = oParams.host || process.env.COM_ETAUKER_ARCHERY_DB_HOST || 'localhost';
        this.user = oParams.user || process.env.COM_ETAUKER_ARCHERY_DB_USER;
        this.password = oParams.password || process.env.COM_ETAUKER_ARCHERY_DB_PASSWORD;
        this.database = oParams.database || process.env.COM_ETAUKER_ARCHERY_DB_DATABASE;
        this.port = oParams.port || process.env.COM_ETAUKER_ARCHERY_DB_PORT;
        this.commit = oParams.commit === false ? false : true;
        this.debug = oParams.debug === true ? true : false;

        // Create the connection pool
        this.pool = mysql.createPool( {
            host     : this.host,
            user     : this.user,
            password : this.password,
            database : this.database,
            port : this.port,
            connectionLimit : 10
        });

        // Ensure that all mandatory parameters have a value
        if (!this.user) this._missingParameter("user");
        if (!this.password) this._missingParameter("password");
        if (!this.database) this._missingParameter("database");
        if (!this.port) this._missingParameter("port");
    }
}

//===========================================
//             PUBLIC FUNCTIONS
//===========================================
ArcheryPersistenceManager.prototype.getSessionTypes = function() {
    return [ "Training", "Competition" ];
};
ArcheryPersistenceManager.prototype.getSessionCategory = function() {
    return [ "Outdoor", "Indoor", "Field" ];
};
ArcheryPersistenceManager.prototype.getDistance = function() {
    return [ "18", "20", "30", "40", "50", "60", "70", "80", "90" ];
};
ArcheryPersistenceManager.prototype.getTargetFaces = function() {
    return [ "3 spot", "25 cm", "40 cm", "80 cm", "122 cm" ];
};
ArcheryPersistenceManager.prototype.getBowCategory = function() {
    return [ "Barebow", "Recurve", "Compound" ];
};
// /**
//  *  Retrieves a user from the database.
//  *  The properties names of the provided object must match the database columns.
//  *  The values of those properties are the values that will be searched in the database.
//  *  @param {object} oUser - The object representing the user to be retrieved from the database.
//  *  @return {promise} Resolves to the user entry from the database.
//  */
// ArcheryPersistenceManager.prototype.getUser = function(oUser) {
//     var sQuery = this._formSelectQuery("USER", oUser);
//     return this._query(sQuery).then(aQueryResult => {
//         if (aQueryResult.length > 1) throw this.error.getError(7, null, "", "Expected 1, received "+aQueryResult.length+".");
//         return aQueryResult[0];
//     });
// };
// /**
//  *  Retrieves a user from the database.
//  *  @param {string} sUser - The username of the user to retrieve from the database.
//  *  @return {promise} Resolves to the user entry from the database.
//  */
// ArcheryPersistenceManager.prototype.getUserByUsername = function(sUsername) {
//     return this.getUser({
//         username: sUsername
//     });
// };
// /**
//  *  Retrieves the roles for a given user.
//  *  The provided user object must contain either a uuid or a username field.
//  *  If a uuid field is provided for the user it will be used to retrieve the roles.
//  *  @param {object} oUser - The object representing the user who's roles should be retrieved from the database.
//  *  @param {string=} oUser.uuid - The UUID of the user for which to retrieve the roles.
//  *  @param {string=} oUser.username - The username of the user for which to retrieve the roles. Only used if the UUID is not provided.
//  *  @return {promise} Resolves to the array of user roles.
//  */
// ArcheryPersistenceManager.prototype.getRolesByUser = function(oUser) {
//
//     // Format the query
//     var sQuery = `SELECT * FROM etauker_archery.ROLE WHERE id IN (SELECT role_id FROM etauker_archery.USER_ROLE `;
//     if (oUser.uuid) {
//         sQuery += `WHERE user_id = "${oUser.uuid}"`;
//     } else if (oUser.username) {
//         sQuery += `WHERE user_id = (SELECT uuid FROM USER WHERE username = "${oUser.username}" LIMIT 1)`;
//     }
//     sQuery += ");";
//
//     // Execute the query
//     return this._query(sQuery).then(aUserRoles => {
//         return aUserRoles;
//     });
// };
// /**
//  *  Creates a database entry for the given user object.
//  *  The password must be provided separately and will be hashed before it is persisted.
//  *  @param {object} oUser - The object representing the user that should be saved in the database.
//  *  @param {string} sPassword - Plain-text password of the user. This function handles the hashing of this password before saving.
//  *  @return {promise} Resolves to the database response object for the transaction.
//  */
// ArcheryPersistenceManager.prototype.createUser = function(oUser, sPassword) {
//     return SecurityPasswordManager.verifyPassword(oUser.username, sPassword).then(sHash => {
//         oUser.password_hash = sHash;
//         var sQuery = this._formInsertQuery("USER", [oUser], Object.keys(oUser))
//         return this._query(sQuery).then(oQueryResult => {
//             return oQueryResult;
//         });
//     });
// };
// ArcheryPersistenceManager.prototype.createRole = function(oRole) {
//     // TODO: Creates a database entry corresponding to the provided object
// };
// ArcheryPersistenceManager.prototype.updateRole = function(oRole) {
//     // TODO: Updates a database entry corresponding to the provided object
// };
// ArcheryPersistenceManager.prototype.updateUser = function(oUser) {
//     // TODO: Updates a database entry corresponding to the provided object
//     // NOTE: The password must be hashed here before saving
// };
// ArcheryPersistenceManager.prototype.deleteRole = function(sRoleId) {
//     // TODO: Deletes a database entry corresponding to the provided object
// };
// ArcheryPersistenceManager.prototype.deleteUser = function(sUserId) {
//     // TODO: Deletes a database entry corresponding to the provided object
// };
// ArcheryPersistenceManager.prototype.assignUserRole = function(sUserId, sRoleId) {
//     // TODO: Assigns the give role to the given user
// };
// ArcheryPersistenceManager.prototype.unassignUserRole = function(sUserId, sRoleId) {
//     // TODO: Deletes the user role corresponding to the given parameters
// };
// // Creates a database entry corresponding to the provided object
// ArcheryPersistenceManager.prototype.saveSession = function(sToken, oDecodedToken, oConfig) {
//
//     var oSession = {
//         id: oDecodedToken.id,
//         jwt: sToken,
//         jwt_algorithm: oConfig.algorithm,
//         user_id: oDecodedToken.sub,
//         original_exp: {
//             type: "timestamp",
//             value: oDecodedToken.exp
//         },
//         original_iat: {
//             type: "timestamp",
//             value: oDecodedToken.iat
//         }
//     };
//
//     var sQuery = this._formInsertQuery("SESSION", [oSession], Object.keys(oSession));
//     return this._query(sQuery).then(oQueryResult => {
//         return oQueryResult;
//     });
// };
// ArcheryPersistenceManager.prototype.extendSession = function(oExtension) {
//     // TODO: Creates a database entry corresponding to the provided object
// };
// ArcheryPersistenceManager.prototype.invalidateSession = function(sUuid) {
//     var sQuery = 'UPDATE `'+this.database+'`.`SESSION` SET `invalid` = 1 WHERE `id` = "'+sUuid+'";';
//     return this._query(sQuery).then(aQueryResult => {
//         return aQueryResult;
//     });
// };
// ArcheryPersistenceManager.prototype.getUuid = function() {
//     var sQuery = 'SELECT UUID() AS uuid;';
//     return this._query(sQuery).then(aQueryResult => {
//         return aQueryResult[0].uuid;
//     });
// };


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
ArcheryPersistenceManager.prototype._formSelectQuery = function(sTable, oEntity) {
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
 *  @param {string} sTable - The name of the database table to which the information will be inserted.
 *  @param {object[]} aEntities - an array of entities to be inserted into the database
 *  @param {string[]=} aFields - The names of the database columns that should be inserted into. If not provided, the property keys of aEntities will be used.
 *  @return {string} The insert statement to be excuted in the database.
 */
ArcheryPersistenceManager.prototype._formInsertQuery = function(sTable, aEntities, aFields) {
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
 *  @param {string} sQuery - The query to be executed in the database.
 *  @param {any[]=} aParams - An array of values to replace the placeholders in the query.
 *  @return {promise} The insert statement to be excuted in the database.
 */
ArcheryPersistenceManager.prototype._query = function(sQuery, aParams) {
    var oContext = this;
    return new Promise((fnResolve, fnReject) => {

        // Guard for non-exitent connection pool
        if (typeof this.pool.query !== 'function') {
            throw this.error.getError(2, { pool: this.pool }, "", "Pool likely does not exist.");
        }

        this.pool.getConnection((oError, oConnection) => {
            if (oError) throw this.error.getError(3, oError);

            oConnection.beginTransaction(oError => {
                if (oError) throw this.error.getError(4, oError);

                oConnection.query(sQuery, (oError, aRows, fields) => {

                    // Error while querying the database
                    if (oError) {
                        oConnection.rollback(() => fnReject(oContext.error.getError(5, oError)));
                    }

                    // Commit the query
                    if (this.commit) {
                        oConnection.commit((oError) => {
                            oConnection.release();
                            if (oError) { fnReject(oContext.error.getError(6, oError)); }
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
 *  @param {string} sParameter - The name of the required parameter that could not be accessed from the constructor.
 *  @throws An error describing what parameter is missing and how to supply it.
 */
ArcheryPersistenceManager.prototype._missingParameter = function(sParameter) {
    var sMessage = `Missing ${sParameter} parameter in the constructor of ArcheryPersistenceManager. `;
    sMessage += `Ensure that process.env.COM_ETAUKER_ARCHERY_DB_${sParameter.toUpperCase()} is set or the parameter is otherwise provided.`;
    throw this.error.getError(1, null, sMessage);
};

module.exports = ArcheryPersistenceManager;
