class GlucosePersistenceWorker {
    //===========================================
    //               CONSTRUCTOR
    //===========================================
    constructor(oParams, paths) {
        //===========================================
        //             PUBLIC FUNCTIONS
        //===========================================
        this.getMealTypes = function () {
            return [
                'Before Work',
                'Breakfast',
                'Lunch',
                'Dinner',
                'Before Bed'
            ];
        };
        /**
         *  Retrieves a set of transactions from the database.
         *  The property names of the provided object must match the database columns.
         *  The values of those properties are the values that will be searched in the database.
         *  @param {com.etauker.glucose.data.IDataLayerGlucoseTransaction} oTransactionFilter - The object containing the filter criteria for the transactions to be retrieved from the database.
         *  @return {promise} Resolves to an array of transactions from the database.
         */
        this.getTransactions = function (oTransactionFilter) {
            const sOrder = 'ORDER BY date_time DESC';
            const sQuery = this._formSelectQuery('TRANSACTION', oTransactionFilter, sOrder);
            this.logger.logObject(sQuery, 'sQuery', 'getTransactions', 'GlucosePersistenceWorker');
            return this._query(sQuery)
                .then(this.logger.logObjectTransparently.bind(this, 'aQueryResult', 'getTransactions', 'GlucosePersistenceWorker'));
        };
        /**
         *  Creates a database entry for the given transaction object.
         *  @param {com.etauker.glucose.data.IDataLayerGlucoseTransaction} oTransaction - The object representing the user that should be saved in the database.
         *  @return {promise} Resolves to the database response object for the transaction.
         */
        this.saveTransaction = function (oTransaction) {
            const sQuery = this._formInsertQuery('TRANSACTION', [oTransaction], Object.keys(oTransaction));
            this.logger.logObject(sQuery, 'sQuery', 'saveTransaction', 'GlucosePersistenceWorker');
            return this._query(sQuery)
                .then(this.logger.logObjectTransparently.bind(this, 'oQueryResult', 'saveTransaction', 'GlucosePersistenceWorker'));
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
         *  @param {string=} sOrderClause - Optional ORDER BY clause. Example: `ORDER BY column DESC`.
         *  @return {string} The query to be excuted in the database.
         */
        this._formSelectQuery = function (sTable, oEntity, sOrderClause = '') {
            let sQuery = `SELECT * FROM \`${this.database}\`.\`${sTable}\` WHERE `;
            // Loop through all properties of the object and format as 'KEY' = 'value'
            const aProperties = Object.keys(oEntity).map(sKey => {
                if (typeof oEntity[sKey] === 'string')
                    return `\`${sKey}\` = '${oEntity[sKey]}'`;
                else if (typeof oEntity[sKey] === 'number')
                    return `\`${sKey}\` = ${oEntity[sKey]}`;
                else
                    return `\`${sKey}\` = ${oEntity[sKey]}`;
            });
            // Join the individual lines with AND and add semicolon at the end
            if (aProperties.length === 1) {
                sQuery = `${sQuery} ${aProperties[0]} ${sOrderClause} LIMIT 1000;`;
            }
            else if (aProperties.length === 0) {
                sQuery = sQuery.replace(' WHERE ', `${sOrderClause};`);
            }
            else {
                sQuery += aProperties.join(' AND ') + ` ${sOrderClause} LIMIT 1000;`;
            }
            return sQuery;
        };
        /**
         *  Generates an INSERT statement from the given object.
         *  Assumes that all properties of the object correspond to the database columns.
         *  Also assumes that the database entry should contain the information provided in the property values.
         *  @param {string} sTable - The name of the database table to which the information will be inserted.
         *  @param {object[]} aEntities - An array of entities to be inserted into the database.
         *  @param {string[]=} aFields - The names of the database columns that should be inserted into. If not provided, the property keys of the first element of aEntities will be used.
         *  @return {string} The insert statement to be excuted in the database.
         */
        this._formInsertQuery = function (sTable, aEntities, aFields) {
            aFields = aFields || Object.keys(aEntities[0]);
            let sQuery = `INSERT INTO \`${this.database}\`.\`${sTable}\` (`;
            sQuery += aFields.join(', ') + ') VALUES ';
            // Loop through all properties of the object and format as 'KEY' = 'value'
            aEntities = aEntities.map(oObject => {
                const aProperties = Object.keys(oObject).map(sKey => {
                    return `'${oObject[sKey]}'`;
                });
                return '(' + aProperties.join(', ') + ')';
            });
            sQuery += aEntities.join(', ') + ';';
            return sQuery;
        };
        /**
         *  Executes the provided query in the database.
         *  @param {string} sQuery - The query to be executed in the database.
         *  @param {any[]=} aParams - An array of values to replace the placeholders in the query.
         *  @throws An error if connecting to the database or executing the statement failed.
         *  @return {promise} The insert statement to be excuted in the database.
         */
        this._query = function (sQuery, aParams) {
            const oContext = this;
            return new Promise((fnResolve, fnReject) => {
                // Guard for non-exitent connection pool
                if (typeof this.pool.query !== 'function') {
                    throw this.error.getError(2, { pool: this.pool }, '', 'Pool likely does not exist.');
                }
                this.pool.getConnection((oError, oConnection) => {
                    if (oError)
                        throw this.error.getError(3, oError);
                    oConnection.beginTransaction(oError => {
                        if (oError)
                            throw this.error.getError(4, oError);
                        oConnection.query(sQuery, (oError, aRows, fields) => {
                            // Error while querying the database
                            if (oError) {
                                oConnection.rollback(() => fnReject(oContext.error.getError(5, oError)));
                            }
                            // Commit the query
                            if (this.commit) {
                                oConnection.commit((oError) => {
                                    oConnection.release();
                                    if (oError) {
                                        fnReject(oContext.error.getError(6, oError));
                                    }
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
        this._missingParameter = function (sParameter) {
            let sMessage = `Missing ${sParameter} parameter in the constructor of GlucosePersistenceWorker. `;
            sMessage += `Ensure that process.env.COM_ETAUKER_GLUCOSE_DB_${sParameter.toUpperCase()} is set or the parameter is otherwise provided.`;
            throw this.error.getError(1, null, sMessage);
        };
        const mysql = require('mysql');
        const GlucoseLogger = require(paths.GlucoseLoggerPath);
        const ErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        this.GlucoseTransaction = require(paths.GlucoseTransactionPath);
        // Objects
        this.logger = new GlucoseLogger(paths);
        this.error = new ErrorGenerator('com.etauker.glucose', 'persistence', 'GlucosePersistenceWorker', [
            { code: 1, http: 500, message: 'Missing parameters' },
            { code: 2, http: 500, message: 'Database connection pool issue occured.' },
            { code: 3, http: 500, message: 'Error getting database connection.' },
            { code: 4, http: 500, message: 'Error starting a transaction.' },
            { code: 5, http: 500, message: 'Error querying the database.' },
            { code: 6, http: 500, message: 'Error committing query to the database.' },
            { code: 7, http: 500, message: 'Unexpected number of results.' }
        ]);
        // Set class variables
        oParams = oParams || {};
        this.host = oParams.host || process.env.COM_ETAUKER_GLUCOSE_DB_HOST || 'localhost';
        this.user = oParams.user || process.env.COM_ETAUKER_GLUCOSE_DB_USER;
        this.password = oParams.password || process.env.COM_ETAUKER_GLUCOSE_DB_PASSWORD;
        this.database = oParams.database || process.env.COM_ETAUKER_GLUCOSE_DB_DATABASE;
        this.port = oParams.port || process.env.COM_ETAUKER_GLUCOSE_DB_PORT || 3306;
        this.commit = oParams.commit === false ? false : true;
        this.debug = oParams.debug === true ? true : false;
        // Create the connection pool
        this.pool = mysql.createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            port: this.port,
            connectionLimit: 10
        });
        // Ensure that all mandatory parameters have a value
        if (!this.user)
            this._missingParameter('user');
        if (!this.password)
            this._missingParameter('password');
        if (!this.database)
            this._missingParameter('database');
        if (!this.port)
            this._missingParameter('port');
    }
    ;
}
module.exports = GlucosePersistenceWorker;
