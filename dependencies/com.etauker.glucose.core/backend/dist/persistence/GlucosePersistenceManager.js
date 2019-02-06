"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GlucoseTransactionInstance;
class GlucosePersistenceManager {
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
         *  Retrieves a transaction corresponding to the provided object from the database.
         *  @param {com.etauker.glucose.data.GlucoseTransaction} oTransactionFilter - The object representing the transaction to be retrieved from the database.
         *  @param {string} sUserId - The id of the user which created the desired transaction. Required to retrieve only the transactions of the current user.
         *  @throws An error if the function is called with insufficient parameters.
         *  @return {promise} Resolves to the transaction entry from the database.
         */
        this.getTransaction = function (oTransactionFilter, sUserId) {
            if (!sUserId)
                throw this.error.getError(1, sUserId, '', 'Missing user id.');
            if (!oTransactionFilter)
                throw this.error.getError(1, oTransactionFilter, '', 'Missing transaction object.');
            oTransactionFilter.createdBy = sUserId;
            let oTransaction = GlucoseTransactionInstance.toDataLayerObject(oTransactionFilter);
            return this.worker.getTransactions(oTransaction)
                .then(this.checkExpectedCount.bind(1))
                .then(aTransactions => aTransactions[0]);
        };
        /**
         *  Retrieves a transaction corresponding to the provided object from the database.
         *  @param {string} sTransactionId - The id of the transaction to retrieve.
         *  @param {string} sUserId - The id of the user which created the desired transaction. Required to retrieve only the transactions of the current user.
         *  @throws An error if the function is called with insufficient parameters.
         *  @return {promise} Resolves to the transaction entry from the database.
         */
        this.getTransactionById = function (sTransactionId, sUserId) {
            if (!sTransactionId)
                throw this.error.getError(1, sTransactionId, '', 'Missing transaction id.');
            if (!sUserId)
                throw this.error.getError(1, sUserId, '', 'Missing user id.');
            let oTransaction = new GlucoseTransactionInstance();
            oTransaction.id = sTransactionId;
            oTransaction.createdBy = sUserId;
            return this.getTransaction(oTransaction);
        };
        /**
         *  Retrieves a transaction corresponding to the provided object from the database.
         *  @param {com.etauker.glucose.data.GlucoseTransaction} oTransactionFilter - The object containing the filter criteria for the transactions to be retrieved from the database.
         *  @param {string} sUserId - The id of the user which created the desired transaction. Required to retrieve only the transactions of the current user.
         *  @throws An error if the function is called with insufficient parameters.
         *  @return {promise} Resolves to an array of transactions from the database.
         */
        this.getTransactions = function (oTransactionFilter, sUserId) {
            if (!sUserId)
                throw this.error.getError(1, sUserId, '', 'Missing user id.');
            if (!oTransactionFilter)
                oTransactionFilter = new GlucoseTransactionInstance();
            oTransactionFilter.createdBy = sUserId;
            let oTransaction = GlucoseTransactionInstance.toDataLayerObject(oTransactionFilter);
            return this.worker.getTransactions(oTransaction);
        };
        /**
         *  Creates a database entry for the given transaction object.
         *  @param {com.etauker.glucose.data.GlucoseTransaction} oTransaction - The object representing the user that should be saved in the database.
         *  @param {string} sUserId - The id of the user which is creating transaction. Required to assign the transaction to the current user.
         *  @throws An error if the function is called with insufficient parameters.
         *  @return {promise} Resolves to the database response object for the statement.
         */
        this.saveTransaction = function (oTransactionObject, sUserId) {
            if (!sUserId)
                throw this.error.getError(1, sUserId, '', 'Missing user id.');
            if (!oTransactionObject)
                throw this.error.getError(1, oTransactionObject, '', 'Missing transaction object.');
            oTransactionObject.createdBy = sUserId;
            oTransactionObject.updatedBy = sUserId;
            let oTransaction = GlucoseTransactionInstance.toDataLayerObject(oTransactionObject);
            return this.worker.saveTransaction(oTransaction);
        };
        //===========================================
        //             PRIVATE FUNCTIONS
        //===========================================
        this.checkExpectedCount = function (iExpectedCount, aResults) {
            if (aResults.length !== iExpectedCount) {
                throw this.error.getError(2, null, '', `Expected ${iExpectedCount}, received ${aResults.length}.`);
            }
            return aResults;
        };
        const mysql = require('mysql');
        const Worker = require(paths.GlucosePersistenceWorkerPath);
        const GlucoseLogger = require(paths.GlucoseLoggerPath);
        const ErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        GlucoseTransactionInstance = require(paths.GlucoseTransactionPath);
        // Objects
        this.debug = (oParams && oParams.debug === true) ? true : false;
        this.logger = new GlucoseLogger(paths);
        this.worker = new Worker(oParams, paths);
        this.error = new ErrorGenerator('com.etauker.glucose', 'persistence', 'GlucosePersistenceManager', [
            { code: 1, http: 500, message: 'Missing parameters.' },
            { code: 2, http: 500, message: 'Unexpected number of results.' }
        ]);
    }
    ;
}
module.exports = GlucosePersistenceManager;
