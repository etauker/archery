"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GlucoseTransaction {
    constructor() { }
}
//===========================================
//                  CONVERTERS
//===========================================
GlucoseTransaction.newInstance = () => {
    return Object.create(GlucoseTransaction);
};
GlucoseTransaction.fromDataLayerObject = (oObject) => {
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
};
GlucoseTransaction.fromPresentationLayerObject = (oObject) => {
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
};
GlucoseTransaction.toDataLayerObject = (oObject) => {
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
    };
    instance = GlucoseTransaction.removeNullProperties(instance);
    return instance;
};
GlucoseTransaction.toPresentationLayerObject = (oObject) => {
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
    };
    return instance;
};
//===========================================
//                  HELPERS
//===========================================
GlucoseTransaction.removeNullProperties = (oObject) => {
    for (let property in oObject) {
        if (oObject[property] === null)
            delete oObject[property];
    }
    return oObject;
};
GlucoseTransaction.formatDateTime = (oDate) => {
    let sDateString = oDate.toISOString().slice(0, 19).replace('T', ' ');
    return sDateString;
};
exports.GlucoseTransaction = GlucoseTransaction;
module.exports = GlucoseTransaction;
