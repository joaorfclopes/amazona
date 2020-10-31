import moment from "moment/min/moment-with-locales";

export const formatDateDayHour = (date) => {
  const dateDay = moment(date).locale("pt").format("L");
  const dateHour = moment(date).locale("pt").format("LT");
  const finalDate = `${dateDay}, ${dateHour}`;
  return finalDate;
};

export const formatDateDay = (date) => {
  const dateDay = moment(date).locale("pt").format("L");
  return dateDay;
};

export const formatDateHour = (date) => {
  const dateHour = moment(date).locale("pt").format("LT");
  return dateHour;
};
