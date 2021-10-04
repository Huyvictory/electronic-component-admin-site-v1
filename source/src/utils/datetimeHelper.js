import moment from 'moment';
import { DATE_FORMAT_VALUE, DATE_FORMAT_DISPLAY } from '../constants';

export const convertUtcToLocalTime = (utcTime, format = DATE_FORMAT_DISPLAY) => {
    try {
        if(utcTime)
            return moment(moment.utc(utcTime, format).toDate()).format(format);
        return '';
    }
    catch(err) {
        return '';
    }
}
export const convertLocalTimeToUtc = (localTime, format) => {
    try {
        if(localTime)
            return moment(localTime, format).utc().format(format);
        return '';
    }
    catch(err) {
        return '';
    }
}

export const convertStringToDateTime = (strFormDateTime, fromFormat = DATE_FORMAT_VALUE, toFormat = DATE_FORMAT_DISPLAY) => {
    try {
        if(strFormDateTime) {
            const datetime = moment(strFormDateTime, fromFormat);
            return moment((datetime).format(toFormat), toFormat);
        }
        return null;
    }
    catch(err) {
        return null
    }
}

export const convertStringToDateTimeString = (strFormDateTime, fromFormat = DATE_FORMAT_VALUE, toFormat = DATE_FORMAT_DISPLAY) => {
    try {
        if(strFormDateTime) {
            const datetime = moment(strFormDateTime, fromFormat);
            return moment((datetime).format(toFormat), toFormat).format(toFormat);
        }
        return null;
    }
    catch(err) {
        return null
    }
}

export const convertDateTimeToString = (datetime, stringFormat = DATE_FORMAT_VALUE) => {
    try {
        if(datetime) {
            return datetime.format(stringFormat);
        }
        return null;
    }
    catch(err) {
        return null
    }
}

export const getDisabledHours = (minValue) => {
    const hours = [];
    for(let i = 0; i < 24; i++) {
        if(minValue && i < minValue.hours()) {
            hours.push(i);
        }
    }
    return hours;

}

export const getDisabledMinutes = (selectedHour, minValue) => {
    const minutes = [];
    for(let i = 0; i < 60; i++) {
        if(minValue && minValue.hours() === selectedHour && i < minValue.minutes()) {
            minutes.push(i);
        }
    }
    return minutes;
}