const isIdValid = (id) => {
  return /^\d+$/.test(id);
};

const isLimitValid = (limit) => {
  return /^\d+$/.test(limit);
};

const isDateValid = (date) => {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date);
};

module.exports = { isIdValid, isLimitValid, isDateValid };
