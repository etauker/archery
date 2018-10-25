const mysql = require('mysql');
const ErrorGenerator = require(GlucoseErrorGeneratorPath);

class GlucosePersistenceManager {

    constructor(oParams) {

        // Objects
        this.error = new ErrorGenerator(
            "com.etauker.glucose",
            "persistence",
            "GlucosePersistenceManager",
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
        this.host = oParams.host || process.env.COM_ETAUKER_GLUCOSE_DB_HOST || 'localhost';
        this.user = oParams.user || process.env.COM_ETAUKER_GLUCOSE_DB_USER;
        this.password = oParams.password || process.env.COM_ETAUKER_GLUCOSE_DB_PASSWORD;
        this.database = oParams.database || process.env.COM_ETAUKER_GLUCOSE_DB_DATABASE;
        this.commit = oParams.commit === false ? false : true;
        this.debug = oParams.debug === true ? true : false;

        // Create the connection pool
        this.pool = mysql.createPool( {
            host     : this.host,
            user     : this.user,
            password : this.password,
            database : this.database,
            connectionLimit : 10
        });

        // Ensure that all mandatory parameters have a value
        if (!this.user) this._missingParameter("user");
        if (!this.password) this._missingParameter("password");
        if (!this.database) this._missingParameter("database");
    }
}

//===========================================
//             PUBLIC FUNCTIONS
//===========================================
GlucosePersistenceManager.prototype.getMealTypes = function() {
    return [
        "Before Work",
        "Breakfast",
        "Lunch",
        "Dinner",
        "Before Bed"
    ];
};
/**
 *  Retrieves a transaction from the database.
 *  The properties names of the provided object must match the database columns.
 *  The values of those properties are the values that will be searched in the database.
 *  @param {object} oTransaction - The object representing the transaction to be retrieved from the database.
 *  @return {promise} Resolves to the transaction entry from the database.
 */
GlucosePersistenceManager.prototype.getTransaction = function(oTransaction) {
    var sQuery = this._formSelectQuery('TRANSACTION', oTransaction);
    return this._query(sQuery).then(aQueryResult => {
        if (aQueryResult.length > 1) throw this.error.getError(7, null, "", "Expected 1, received "+aQueryResult.length+".");
        return aQueryResult[0];
    });
};
/**
 *  Retrieves a set of transactions from the database.
 *  The properties names of the provided object must match the database columns.
 *  The values of those properties are the values that will be searched in the database.
 *  @param {object} oTransactionFilter - The object containing the filter criteria for the transactions to be retrieved from the database.
 *  @return {promise} Resolves to an array of transactions from the database.
 */
GlucosePersistenceManager.prototype.getTransactions = function(oTransactionFilter) {
    let sQuery = `SELECT * FROM ${this.database}.\`TRANSACTION\` WHERE LIMIT 500;`;
    if (oTransactionFilter) sQuery = this._formSelectQuery('TRANSACTION', oTransactionFilter);
    return this._query(sQuery).then(aQueryResult => {
        return aQueryResult;
    });
};
/**
 *  Creates a database entry for the given transaction object.
 *  @param {object} oTransaction - The object representing the user that should be saved in the database.
 *  @return {promise} Resolves to the database response object for the transaction.
 */
GlucosePersistenceManager.prototype.saveTransaction = function(oTransaction) {
    var sQuery = this._formInsertQuery("TRANSACTION", [oTransaction], Object.keys(oTransaction))
    return this._query(sQuery).then(oQueryResult => {
        return oQueryResult;
    });
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
GlucosePersistenceManager.prototype._formSelectQuery = function(sTable, oEntity) {
    var sQuery = `SELECT * FROM ${this.database}.${sTable} WHERE `;

    // Loop through all properties of the object and format as 'KEY = "value"'
    var aProperties = Object.keys(oEntity).map(sKey => {
        return `${sKey} = "${oEntity[sKey]}"`;
    })

    // Join the individual lines with AND and add semicolon at the end
    sQuery += aProperties.join(" AND ") + " LIMIT 1000;";
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
GlucosePersistenceManager.prototype._formInsertQuery = function(sTable, aEntities, aFields) {
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
GlucosePersistenceManager.prototype._query = function(sQuery, aParams) {
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
GlucosePersistenceManager.prototype._missingParameter = function(sParameter) {
    var sMessage = `Missing ${sParameter} parameter in the constructor of GlucosePersistenceManager. `;
    sMessage += `Ensure that process.env.COM_ETAUKER_GLUCOSE_DB_${sParameter.toUpperCase()} is set or the parameter is otherwise provided.`;
    throw this.error.getError(1, null, sMessage);
};

module.exports = GlucosePersistenceManager;
