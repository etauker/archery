export interface IDataLayerGlucoseTransaction {
    id:                     string | null;
    created_at:             string | null;
    updated_at:             string | null;
    created_by:             string | null;
    updated_by:             string | null;
    date_time:              string | null;
    reading:                number | null;
    carbohydrates:          number | null;
    insulin_units_short:    number | null;
    insulin_units_long:     number | null;
    correction_units:       number | null;
    meal:                   string | null;
    note:                   string | null;
}

export interface IPresentationLayerGlucoseTransaction {
    id:                     string | null;
    dateTime:               number | null;
    reading:                number | null;
    carbohydrates:          number | null;
    insulinUnitsShort:      number | null;
    insulinUnitsLong:       number | null;
    correctionUnits:        number | null;
    meal:                   string | null;
    note:                   string | null;
}
