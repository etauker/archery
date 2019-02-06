interface Transaction {
    id?:                     string | null;
    dateTime?:               number | null;
    reading?:                number | null;
    carbohydrates?:          number | null;
    insulinUnitsShort?:      number | null;
    insulinUnitsLong?:       number | null;
    correctionUnits?:        number | null;
    meal?:                   string | null;
    note?:                   string | null;
    timestamp?:              number | null;
    weekday?:                string | null;
}
