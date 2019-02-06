import { IDataLayerGlucoseTransaction, IPresentationLayerGlucoseTransaction } from '../exports';

export class GlucoseTransaction {

    constructor() {}

    //===========================================
    //               PROPERTIES
    //===========================================
    public id:                 string;
    public createdAt:          Date | null;
    public updatedAt:          Date | null;
    public createdBy:          string | null;
    public updatedBy:          string | null;
    public dateTime:           Date | null;
    public reading:            number | null;
    public carbohydrates:      number | null;
    public insulinUnitsShort:  number | null;
    public insulinUnitsLong:   number | null;
    public correctionUnits:    number | null;
    public meal:               string | null;
    public note:               string | null;

    //===========================================
    //                  CONVERTERS
    //===========================================
    public static newInstance = (): GlucoseTransaction => {
        return Object.create(GlucoseTransaction);
    }

    public static fromDataLayerObject = (oObject: IDataLayerGlucoseTransaction): GlucoseTransaction => {
        let instance = Object.create(GlucoseTransaction);
        instance.id = oObject.id || null;
        instance.createdAt = (oObject.created_at ? new Date(oObject.created_at) : null);
        instance.updatedAt = (oObject.updated_at ? new Date(oObject.updated_at) : null);
        instance.createdBy = oObject.created_by || null;
        instance.updatedBy = oObject.updated_by || null;
        instance.dateTime = (oObject.date_time ? new Date(oObject.date_time) : null);
        instance.reading = oObject.reading || null;
        instance.carbohydrates = oObject.carbohydrates || null;
        instance.insulinUnitsShort = oObject.insulin_units_short || null;
        instance.insulinUnitsLong = oObject.insulin_units_long || null;
        instance.correctionUnits = oObject.correction_units || null;
        instance.meal = oObject.meal || null;
        instance.note = oObject.note || null;
        return instance;
    }
    public static fromPresentationLayerObject = (oObject: IPresentationLayerGlucoseTransaction): GlucoseTransaction => {
        let instance = Object.create(GlucoseTransaction);
        instance.id = oObject.id || null;
        instance.createdAt = null;
        instance.updatedAt = null;
        instance.createdBy = null;
        instance.updatedBy = null;
        instance.dateTime = new Date(oObject.dateTime) || null;
        instance.reading = oObject.reading || null;
        instance.carbohydrates = oObject.carbohydrates || null;
        instance.insulinUnitsShort = oObject.insulinUnitsShort || null;
        instance.insulinUnitsLong = oObject.insulinUnitsLong || null;
        instance.correctionUnits = oObject.correctionUnits || null;
        instance.meal = oObject.meal || null;
        instance.note = oObject.note || null;
        return instance;
    }
    public static toDataLayerObject = (oObject: GlucoseTransaction): IDataLayerGlucoseTransaction => {
        let instance = {
            id: oObject.id || null,
            created_at: (oObject.createdAt ? GlucoseTransaction.formatDateTime(oObject.createdAt) : null),
            updated_at: (oObject.updatedAt ? GlucoseTransaction.formatDateTime(oObject.updatedAt) : null),
            created_by: oObject.createdBy || null,
            updated_by: oObject.updatedBy || null,
            date_time: (oObject.dateTime ? GlucoseTransaction.formatDateTime(oObject.dateTime) : null),
            reading: oObject.reading || null,
            carbohydrates: oObject.carbohydrates || null,
            insulin_units_short: oObject.insulinUnitsShort || null,
            insulin_units_long: oObject.insulinUnitsLong || null,
            correction_units: oObject.correctionUnits || null,
            meal: oObject.meal || null,
            note: oObject.note || null
        }
        instance = GlucoseTransaction.removeNullProperties(instance);
        return instance;
    }
    public static toPresentationLayerObject = (oObject: GlucoseTransaction): IPresentationLayerGlucoseTransaction => {
        let instance = {
            id: oObject.id || null,
            dateTime: oObject.dateTime ? oObject.dateTime.valueOf() : null,
            reading: oObject.reading || null,
            carbohydrates: oObject.carbohydrates || null,
            insulinUnitsShort: oObject.insulinUnitsShort || null,
            insulinUnitsLong: oObject.insulinUnitsLong || null,
            correctionUnits: oObject.correctionUnits || null,
            meal: oObject.meal || null,
            note: oObject.note || null
        }
        return instance;
    }

    //===========================================
    //                  HELPERS
    //===========================================
    private static removeNullProperties = (oObject) => {
        for (let property in oObject) {
            if (oObject[property] === null) delete oObject[property];
        }
        return oObject;
    }
    private static formatDateTime = (oDate: Date): string => {
        let sDateString = oDate.toISOString().slice(0, 19).replace('T', ' ');
        return sDateString;
    }
}

module.exports = GlucoseTransaction;
