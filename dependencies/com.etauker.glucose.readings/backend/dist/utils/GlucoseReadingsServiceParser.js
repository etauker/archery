"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GlucoseReadingsServiceParser {
    //===========================================
    //               CONSTRUCTOR
    //===========================================
    constructor(paths) {
        this.errorMessages = [];
        this.idRegex = /.{8}-.{4}-.{4}-.{4}-.{12}/;
        //===========================================
        //             PUBLIC FUNCTIONS
        //===========================================
        this.parseTransaction = (oTransaction) => {
            this.logger.logObject(oTransaction, 'start', 'parseTransaction', 'GlucoseReadingsServiceParser');
            let oParsed;
            try {
                oParsed = {
                    id: oTransaction['id'] ? oTransaction['id'].toString() : null,
                    dateTime: oTransaction['dateTime'] ? parseInt(oTransaction['dateTime'].toString()) : null,
                    reading: oTransaction['reading'] ? parseFloat(oTransaction['reading'].toString()) : null,
                    carbohydrates: oTransaction['carbohydrates'] ? parseInt(oTransaction['carbohydrates'].toString()) : null,
                    insulinUnitsShort: oTransaction['insulinUnitsShort'] ? parseInt(oTransaction['insulinUnitsShort'].toString()) : null,
                    insulinUnitsLong: oTransaction['insulinUnitsLong'] ? parseInt(oTransaction['insulinUnitsLong'].toString()) : null,
                    correctionUnits: oTransaction['correctionUnits'] ? parseInt(oTransaction['correctionUnits'].toString()) : null,
                    meal: oTransaction['meal'] ? oTransaction['meal'].toString() : null,
                    note: oTransaction['note'] ? oTransaction['note'].toString() : null
                };
            }
            catch (oError) {
                this.lastError = this.error.getError(1, oError);
            }
            this.logger.logObject(oParsed, 'end', 'parseTransaction', 'GlucoseReadingsServiceParser');
            return oParsed;
        };
        this.getLastError = function () {
            return this.lastError;
        };
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        const GlucoseLogger = require(paths.GlucoseLoggerPath);
        this.logger = new GlucoseLogger(paths);
        this.errorMessages = [
            { code: 1, http: 400, message: "An error occured while parsing incoming data." }
        ];
        this.error = new GlucoseErrorGenerator("com.etauker.glucose", "utils", "GlucoseReadingsServiceParser", this.errorMessages);
        this.lastError = null;
    }
}
;
module.exports = GlucoseReadingsServiceParser;
