interface DataLayerGlucoseTransaction {
    readonly id:            string;
    readonly created_at:    number|null;
    readonly created_by:    string|null;
    readonly updated_at:    number|null;
    readonly updated_by:    string|null;
    date_time:              number|null;
    reading:                number|null;
    carbohydrates:          number|null;
    insulin_units_short:    number|null;
    insulin_units_long:     number|null;
    correction_units:       number|null;
    meal:                   string|null;
    note:                   string|null;
}

interface PresentationLayerGlucoseTransaction {
    readonly id:            string;
    readonly createdAt:     number|null;
    readonly createdBy:     string|null;
    readonly updatedAt:     number|null;
    updatedBy:              string|null;
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
    private id:                 string;
    private createdAt:          Date|null;
    private createdBy:          string|null;
    private updatedAt:          Date|null;
    private updatedBy:          string|null;
    private dateTime:           Date|null;
    private reading:            number|null;
    private carbohydrates:      number|null;
    private insulinUnitsShort:  number|null;
    private insulinUnitsLong:   number|null;
    private correctionUnits:    number|null;
    private meal:               string|null;
    private note:               string|null;

    // Getters
    get id(): string {
        return this.id;
    }
    get createdAt(): Date|null {
        return this.createdAt;
    }
    get createdBy(): string|null {
        return this.createdBy;
    }
    get updatedAt(): Date|null {
        return this.updatedAt;
    }
    get updatedBy(): string|null {
        return this.updatedBy;
    }
    get dateTime(): Date|null {
        return this.dateTime;
    }
    get reading(): number|null {
        return this.reading;
    }
    get carbohydrates(): number|null {
        return this.carbohydrates;
    }
    get insulinUnitsShort(): number|null {
        return this.insulinUnitsShort;
    }
    get insulinUnitsLong(): number|null {
        return this.insulinUnitsLong;
    }
    get correctionUnits(): number|null {
        return this.correctionUnits;
    }
    get meal(): string|null {
        return this.meal;
    }
    get note(): string|null {
        return this.note;
    }

    // Setters
    set id(newId: string) {
        console.log('GlucoseTransaction.id is readonly and cannot be updated');
        return this;
    }
    set createdAt(newCreatedAt: Date|null) {
        console.log('GlucoseTransaction.createdAt is readonly and cannot be updated');
        return this;
    }
    set createdBy(newCreatedBy: string|null) {
        console.log('GlucoseTransaction.createdBy is readonly and cannot be updated');
        return this;
    }
    set updatedAt(newUpdatedAt: Date|null) {
        console.log('GlucoseTransaction.updatedAt is readonly and cannot be updated');
        return this;
    }
    set updatedBy(newUpdatedBy: string|null) {
        // let idRegex = /.{8}-.{4}-.{4}-.{4}-.{12}/g;
        // if (!idRegex.test(newUpdatedBy)) {
        //     console.log('GlucoseTransaction.updatedBy cannot be set to an invalid UUID')
        // } else {
            this.updatedBy = newUpdatedBy;
        // }
        return this;
    }
    set dateTime(newDateTime: Date|null) {
        this.dateTime = newDateTime;
        return this;
    }
    set reading(newReading: number|null) {
        this.reading = newReading;
        return this;
    }
    set carbohydrates(newCarbohydrates: number|null) {
        this.carbohydrates = newCarbohydrates;
        return this;
    }
    set insulinUnitsShort(newInsulinUnitsShort: number|null) {
        this.insulinUnitsShort = newInsulinUnitsShort;
        return this;
    }
    set insulinUnitsLong(newInsulinUnitsLong: number|null) {
        this.insulinUnitsLong = newInsulinUnitsLong;
        return this;
    }
    set correctionUnits(newCorrectionUnits: number|null) {
        this.correctionUnits = newCorrectionUnits;
        return this;
    }
    set meal(newMeal: string|null) {
        this.meal = newMeal;
        return this;
    }
    set note(newNote: string|null) {
        this.note = newNote;
        return this;
    }

    fromDataLayerObject(oObject) {
        console.log("Generating GlucoseTransaction from DataLayerObject.");
        return this;
    }

    fromPresentationLayerObject(oObject) {
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


module.exports.DataLayerGlucoseTransaction = DataLayerGlucoseTransaction;
module.exports.PresentationLayerGlucoseTransaction = PresentationLayerGlucoseTransaction;
module.exports.GlucoseTransaction = GlucoseTransaction;
