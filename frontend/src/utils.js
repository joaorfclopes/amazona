import moment from "moment";

export const formatDateDayHour = (date) => {
  let momentDate = moment(date).locale("pt");
  const momentDateDay = momentDate.format("L");
  const momentDateHour = momentDate.format("LT");
  const finalDate = `${momentDateDay}, ${momentDateHour}`;
  return finalDate;
};

export const formatDateDay = (date) => {
  let momentDate = moment(date).locale("pt");
  const momentDateDay = momentDate.format("L");
  return momentDateDay;
};

export const formatDateHour = (date) => {
  let momentDate = moment(date).locale("pt");
  const momentDateHour = momentDate.format("LT");
  return momentDateHour;
};
