import * as moment from 'moment';
import { DurationInputArg1 } from 'moment';
import DurationConstructor = moment.unitOfTime.DurationConstructor;

const DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss';

function getCurrentDate() {
  return moment().local().format(DATE_FORMAT);
}

function getCurrentDateWithExpiration(amount: DurationInputArg1, unit: DurationConstructor) {
  return moment().add(amount, unit).format(DATE_FORMAT);
}

export {
  getCurrentDate,
  getCurrentDateWithExpiration
};
