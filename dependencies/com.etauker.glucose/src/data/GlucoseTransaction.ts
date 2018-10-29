interface IDataLayerGlucoseTransaction {
    id:                     string;
    created_at:             string|null;
    updated_at:             string|null;
    created_by:             string|null;
    updated_by:             string|null;
    date_time:              string|null;
    reading:                number|null;
    carbohydrates:          number|null;
    insulin_units_short:    number|null;
    insulin_units_long:     number|null;
    correction_units:       number|null;
    meal:                   string|null;
    note:                   string|null;
}

interface IPresentationLayerGlucoseTransaction {
    id:                     string;
    dateTime:               number|null;
    reading:                number|null;
    carbohydrates:          number|null;
    insulinUnitsShort:      number|null;
    insulinUnitsLong:       number|null;
    correctionUnits:        number|null;
    meal:                   string|null;
    note:                   string|null;
}

class GlucoseTransaction {

    //===========================================
    //               PROPERTIES
    //===========================================
    public id:                 string;
    public createdAt:          Date|null;
    public updatedAt:          Date|null;
    public createdBy:          string|null;
    public updatedBy:          string|null;
    public dateTime:           Date|null;
    public reading:            number|null;
    public carbohydrates:      number|null;
    public insulinUnitsShort:  number|null;
    public insulinUnitsLong:   number|null;
    public correctionUnits:    number|null;
    public meal:               string|null;
    public note:               string|null;

    // //===========================================
    // //                  GETTERS
    // //===========================================
    // get id():                   string          { return this._id; }
    // get createdAt():            Date|null       { return this._createdAt; }
    // get updatedAt():            Date|null       { return this._updatedAt; }
    // get createdBy():            string|null     { return this._createdBy; }
    // get updatedBy():            string|null     { return this._updatedBy; }
    // get dateTime():             Date|null       { return this._dateTime; }
    // get reading():              number|null     { return this._reading; }
    // get carbohydrates():        number|null     { return this._carbohydrates; }
    // get insulinUnitsShort():    number|null     { return this._insulinUnitsShort; }
    // get insulinUnitsLong():     number|null     { return this._insulinUnitsLong; }
    // get correctionUnits():      number|null     { return this._correctionUnits; }
    // get meal():                 string|null     { return this._meal; }
    // get note():                 string|null     { return this._note; }

    // //===========================================
    // //                  SETTERS
    // //===========================================
    // set id(newId: string)                                       { this._id = newId; }
    // set createdAt(newCreatedAt: Date|null)                      { this._createdAt = newCreatedAt; }
    // set updatedAt(newUpdatedAt: Date|null)                      { this._updatedAt = newUpdatedAt; }
    // set createdBy(newCreatedBy: string|null)                    { this._createdBy = newCreatedBy; }
    // set updatedBy(newUpdatedBy: string|null)                    { this._updatedBy = newUpdatedBy; }
    // set dateTime(newDateTime: Date|null)                        { this._dateTime = newDateTime; }
    // set reading(newReading: number|null)                        { this._reading = newReading; }
    // set carbohydrates(newCarbohydrates: number|null)            { this._carbohydrates = newCarbohydrates; }
    // set insulinUnitsShort(newInsulinUnitsShort: number|null)    { this._insulinUnitsShort = newInsulinUnitsShort; }
    // set insulinUnitsLong(newInsulinUnitsLong: number|null)      { this._insulinUnitsLong = newInsulinUnitsLong; }
    // set correctionUnits(newCorrectionUnits: number|null)        { this._correctionUnits = newCorrectionUnits; }
    // set meal(newMeal: string|null)                              { this._meal = newMeal; }
    // set note(newNote: string|null)                              { this._note = newNote; }

    //===========================================
    //                  CONVERTERS
    //===========================================
    public static fromDataLayerObject = (oObject: IDataLayerGlucoseTransaction): GlucoseTransaction => {
        console.log("Generating GlucoseTransaction from DataLayerObject.");
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
        console.log("Generating GlucoseTransaction from PresentationLayerObject.");
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
        console.log("Generating DataLayerObject from GlucoseTransaction.");

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
        console.log("Generating PresentationLayerObject from GlucoseTransaction.");

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
        instance = GlucoseTransaction.removeNullProperties(instance);
        return instance;
    }
    public static removeNullProperties = (oObject) => {
        for (let property in oObject) {
            if (oObject[property] === null) delete oObject[property];
        }
        return oObject;
    }
    public static formatDateTime = (oDate: Date): string => {
        let sDateString = oDate.toISOString().slice(0, 19).replace('T', ' ');
        return sDateString;
    }
}

module.exports = GlucoseTransaction;
