import { IPresentationLayerGlucoseTransaction } from '../exports';


class GlucoseReadingsServiceParser {

    //===========================================
    //              PROPERTIES
    //===========================================
    private error;
    private logger;
    private lastError;
    private errorMessages = [];
    private idRegex = /.{8}-.{4}-.{4}-.{4}-.{12}/;

    //===========================================
    //               CONSTRUCTOR
    //===========================================
    constructor(paths) {
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        const GlucoseLogger = require(paths.GlucoseLoggerPath);

        this.logger = new GlucoseLogger(paths);
        this.errorMessages = [
            { code: 1, http: 400, message: "An error occured while parsing incoming data." }
        ];

        this.error = new GlucoseErrorGenerator(
            "com.etauker.glucose",
            "utils",
            "GlucoseReadingsServiceParser",
            this.errorMessages
        );

        this.lastError = null;
    }

    //===========================================
    //             PUBLIC FUNCTIONS
    //===========================================
    public parseTransaction = (oTransaction: IPresentationLayerGlucoseTransaction): IPresentationLayerGlucoseTransaction => {
        this.logger.logObject(oTransaction, 'start', 'parseTransaction', 'GlucoseReadingsServiceParser');

        let oParsed: IPresentationLayerGlucoseTransaction;
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
            }
        }
        catch (oError) {
            this.lastError = this.error.getError(1, oError);
        }
        this.logger.logObject(oParsed, 'end', 'parseTransaction', 'GlucoseReadingsServiceParser');
        return oParsed;
    };
    public getLastError = function() {
        return this.lastError;
    };

    //===========================================
    //             PRIVATE FUNCTIONS
    //===========================================

};

module.exports = GlucoseReadingsServiceParser;
