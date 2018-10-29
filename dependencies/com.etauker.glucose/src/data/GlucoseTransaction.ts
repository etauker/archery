interface IDataLayerGlucoseTransaction {
    readonly id:            string;
    readonly created_at:    number|null;
    readonly updated_at:    number|null;
    created_by:             string|null;
    updated_by:             string|null;
    date_time:              number|null;
    reading:                number|null;
    carbohydrates:          number|null;
    insulin_units_short:    number|null;
    insulin_units_long:     number|null;
    correction_units:       number|null;
    meal:                   string|null;
    note:                   string|null;
}

interface IPresentationLayerGlucoseTransaction {
    readonly id:            string;
    readonly createdAt:     number|null;
    readonly updatedAt:     number|null;
    readonly createdBy:     string|null;
    readonly updatedBy:     string|null;
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
    private _id:                 string;
    private _createdAt:          Date|null;
    private _updatedAt:          Date|null;
    private _createdBy:          string|null;
    private _updatedBy:          string|null;
    private _dateTime:           Date|null;
    private _reading:            number|null;
    private _carbohydrates:      number|null;
    private _insulinUnitsShort:  number|null;
    private _insulinUnitsLong:   number|null;
    private _correctionUnits:    number|null;
    private _meal:               string|null;
    private _note:               string|null;

    //===========================================
    //                  GETTERS
    //===========================================
    get id():                   string          { return this._id; }
    get createdAt():            Date|null       { return this._createdAt; }
    get updatedAt():            Date|null       { return this._updatedAt; }
    get createdBy():            string|null     { return this._createdBy; }
    get updatedBy():            string|null     { return this._updatedBy; }
    get dateTime():             Date|null       { return this._dateTime; }
    get reading():              number|null     { return this._reading; }
    get carbohydrates():        number|null     { return this._carbohydrates; }
    get insulinUnitsShort():    number|null     { return this._insulinUnitsShort; }
    get insulinUnitsLong():     number|null     { return this._insulinUnitsLong; }
    get correctionUnits():      number|null     { return this._correctionUnits; }
    get meal():                 string|null     { return this._meal; }
    get note():                 string|null     { return this._note; }

    //===========================================
    //                  SETTERS
    //===========================================
    set id(newId: string)                       { console.log('GlucoseTransaction.id is readonly and cannot be updated'); }
    set createdAt(newCreatedAt: Date|null)      { console.log('GlucoseTransaction.createdAt is readonly and cannot be updated'); }
    set updatedAt(newUpdatedAt: Date|null)      { console.log('GlucoseTransaction.updatedAt is readonly and cannot be updated'); }
    set createdBy(newCreatedBy: string|null)                    { this._createdBy = newCreatedBy; }
    set updatedBy(newUpdatedBy: string|null)                    { this._updatedBy = newUpdatedBy; }
    set dateTime(newDateTime: Date|null)                        { this._dateTime = newDateTime; }
    set reading(newReading: number|null)                        { this._reading = newReading; }
    set carbohydrates(newCarbohydrates: number|null)            { this._carbohydrates = newCarbohydrates; }
    set insulinUnitsShort(newInsulinUnitsShort: number|null)    { this._insulinUnitsShort = newInsulinUnitsShort; }
    set insulinUnitsLong(newInsulinUnitsLong: number|null)      { this._insulinUnitsLong = newInsulinUnitsLong; }
    set correctionUnits(newCorrectionUnits: number|null)        { this._correctionUnits = newCorrectionUnits; }
    set meal(newMeal: string|null)                              { this._meal = newMeal; }
    set note(newNote: string|null)                              { this._note = newNote; }

    //===========================================
    //                  CONVERTERS
    //===========================================
    fromDataLayerObject(oObject: IDataLayerGlucoseTransaction) {
    console.log(oObject);
        console.log("Generating GlucoseTransaction from DataLayerObject.");
        return this;
    }
    fromPresentationLayerObject(oObject: IPresentationLayerGlucoseTransaction) {
        console.log(oObject);
        console.log("Generating GlucoseTransaction from PresentationLayerObject.");
        return this;
    }

}

// `id` 	                char(36) 		PRIMARY KEY,
// `date_time`             datetime        DEFAULT NULL,
// `reading`               float(3,1)      DEFAULT NULL,
// `carbohydrates`         smallint(6)     DEFAULT NULL,
// `insulin_units_short`   tinyint(3)      UNSIGNED DEFAULT NULL,
// `insulin_units_long`    tinyint(3)      UNSIGNED DEFAULT NULL,
// `meal`                  varchar(20)     DEFAULT NULL,
// `note`                  text            ,
// `correction_units`      tinyint(3)      UNSIGNED DEFAULT NULL,
// `created_by`		    char(36)		,
// `created_at`		    timestamp 		DEFAULT CURRENT_TIMESTAMP,
// `updated_by`            char(36)		,
// `updated_at`            timestamp 		DEFAULT CURRENT_TIMESTAMP


module.exports.GlucoseTransaction = GlucoseTransaction;
