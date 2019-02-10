import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChartsService {


    mealPeriods = [];

    READING_GROUP = {
        LOW: 'low',
        GOOD: 'good',
        HIGH: 'high',
        VERY_HIGH: 'veryHigh'
    }
    READING_GROUP_COLOURS = {
        LOW: 'blue',
        GOOD: 'green',
        HIGH: 'orange',
        VERY_HIGH: 'red'
    }


    constructor(private http: HttpClient) {
        this.retrieveMealPeriods().then(data => this.mealPeriods = data);
    }



    //===========================================
    //                 PUBLIC
    //===========================================
    public getChartData(chartId: string, start?: number, end?: number) {

        if (!chartId) {
            throw Error('Chart ID not specified in getChartData()');
        }
        else if (chartId === 'chart-1') {
            let data = [];
            let result: any;

            let observable = this.retrieveData();
            return observable.pipe(
               switchMap((value: any) => of(this.processDataForChart(value, start, end)))
            );
        }
    }

    public processDataForChart(data, start, end) {
        data = JSON.parse(data || '[]');

        let transactions = data
            .map(this.addAdditionalProperties.bind(this))
            .filter(transaction => transaction)
            .filter(transaction => transaction.reading)
            .filter(transaction => transaction.timestamp)
            .filter(transaction => transaction.timestamp > start)
            .filter(transaction => transaction.timestamp < end)


        // Get array of point colours
        let readingDataPointColors = transactions.reduce((array, transaction) => {
            array.push(this.getPointColour(transaction));
            return array;
        }, []);

        // Get array of reading data points
        let readingData = transactions.reduce((array, transaction) => {
            array.push({
                x: new Date(transaction.dateTime),
                y: transaction.reading,
                label: transaction.note
            });
            return array;
        }, []);

        // Get min time
        let minTime = transactions.reduce((min, transaction) => {
            if (!transaction.timestamp) return min;
            return transaction.timestamp < min ? transaction.timestamp : min;
        }, Infinity);

        // Get max time
        let maxTime = transactions.reduce((max, transaction) => {
            if (!transaction.timestamp) return max;
            return transaction.timestamp > max ? transaction.timestamp : max;
        }, 0);

        // Get min reading
        let minReading = transactions.reduce((min, transaction) => {
            if (!transaction.reading) return min;
            return transaction.reading < min ? transaction.reading : min;
        }, Infinity);

        // Get max reading
        let maxReading = transactions.reduce((max, transaction) => {
            if (!transaction.reading) return max;
            return transaction.reading > max ? transaction.reading : max;
        }, 0);

        // Get min insulin units
        let minInsulinUnitsShort = transactions.reduce((min, transaction) => {
            if (!transaction.insulinUnitsShort) return min;
            return transaction.insulinUnitsShort < min ? transaction.insulinUnitsShort : min;
        }, Infinity);

        // Get max insulin units
        let maxInsulinUnitsShort = transactions.reduce((max, transaction) => {
            if (!transaction.insulinUnitsShort) return max;
            return transaction.insulinUnitsShort > max ? transaction.insulinUnitsShort : max;
        }, 0);


        return {
            readingDataPointColors: readingDataPointColors,
            readingData: readingData,
            minTime: minTime,
            maxTime: maxTime,
            minReading: minReading,
            maxReading: maxReading,
            minInsulinUnitsShort: minInsulinUnitsShort,
            maxInsulinUnitsShort: maxInsulinUnitsShort
        }
    }



    //===========================================
    //                 AJAX CALLS
    //===========================================
    private retrieveData() {
        return this.http.get(`/glucose/readings/get`, { responseType: 'text' as 'json' });
    }
    private retrieveMealPeriods() {
        return this.http.get(`assets/data/MealPeriods.json`, { responseType: 'text' as 'json' })
            .toPromise()
            .then((data: any) => JSON.parse(data))
            .catch(error => {
                console.error(error);
                return [];
            });
    }


    //===========================================
    //                 PRIVATE
    //===========================================
    private addAdditionalProperties(transaction) {
        if (!transaction) { return null; }
        if (!transaction.dateTime) { return null; }

        const weekdays = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];

        const dateTime = new Date(transaction.dateTime);
        transaction.timestamp = dateTime.valueOf();
        transaction.weekday = weekdays[dateTime.getDay()];
        return transaction;
    }

    private getColourByGroupId(groupId) {
        let key = Object.keys(this.READING_GROUP).find(key => this.READING_GROUP[key] === groupId);
        let colour = this.READING_GROUP_COLOURS[key] || undefined;
        return colour;
    }

    /*
    *   Takes a date string in the format of ""
    *   and a timeString in the format of "hh:mm"
    *
    *   Returns a new object using the day from the dateString
    *   and the time from timeString.
    */
    private getDateObject(dateString, timeString) {
        let dateTime = new Date(dateString);
        let hours = timeString.substring(0, 2);
        let minutes = timeString.substring(3, 5);
        dateTime.setHours(hours as any);
        dateTime.setMinutes(minutes as any);
        return dateTime;
    }

    private getPointColour(transaction) {
        let transactionDateTime = new Date(transaction.dateTime);
        let matchingPeriod = this.mealPeriods.find(period => {

            // Set the transaction date time as the start date time
            let startDateTime = this.getDateObject(transaction.dateTime, period.startTime);
            let endDateTime = this.getDateObject(transaction.dateTime, period.endTime);

            // Correction for where transaction is just before or just after midnight
            if (endDateTime.getHours() < startDateTime.getHours() && transactionDateTime.getHours() < 6) {
                startDateTime.setDate(startDateTime.getDate() - 1);
            }
            else if (endDateTime.getHours() < startDateTime.getHours() && transactionDateTime.getHours() > 6) {
                endDateTime.setDate(endDateTime.getDate() + 1);
            }

            // Find the correct period for the transaction
            return (transactionDateTime.valueOf() >= startDateTime.valueOf()) && (transactionDateTime.valueOf() <= endDateTime.valueOf());
        });

        let reading = transaction.reading;
        let matchingGroup = matchingPeriod.groups.find(group => {
            return (reading >= group.minValue) && (reading <= group.maxValue);
        });

        return this.getColourByGroupId(matchingGroup.groupId);
    }
}
