const DateOps = {
  padSingleDigit: (dateValue: string): string => {
    if (dateValue === '0' || dateValue === '00') {
      return '01';
    }
    return dateValue.length === 1 ? `0${dateValue}` : dateValue;
  },
};

export default DateOps;
