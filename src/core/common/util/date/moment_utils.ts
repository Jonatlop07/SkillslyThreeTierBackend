import * as moment from 'moment';

function getCurrentDate() {
  const DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss';
  return moment().local().format(DATE_FORMAT);
}

export {
  getCurrentDate
};
