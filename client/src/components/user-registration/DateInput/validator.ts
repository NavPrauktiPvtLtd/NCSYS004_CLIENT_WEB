import moment from 'moment';

interface Options {
  minDate?: string;
  maxDate?: string;
  invalidError?: string;
  minDateError?: string;
  maxDateError?: string;
}

interface Rule {
  checker: (value: string) => boolean;
  errorMessage: string;
}

const getDefaultRules = (
  dateValue: string,
  { minDate, maxDate, invalidError, minDateError, maxDateError }: Options
): Rule[] => {
  const dateFormat = 'DD-MM-YYYY';
  const defaultRules: Rule[] = [];

  if (dateValue.length === 10) {
    defaultRules.push({
      checker: () => moment(dateValue, dateFormat, true).isValid(),
      errorMessage: invalidError || 'Please input a valid date',
    });
  }

  if (dateValue.length === 10 && minDate) {
    defaultRules.push({
      checker: () => moment(dateValue, dateFormat).isSameOrAfter(moment(minDate, dateFormat)),
      errorMessage: minDateError || 'The date is too early',
    });
  }

  if (dateValue.length === 10 && maxDate) {
    defaultRules.push({
      checker: () => moment(dateValue, dateFormat).isSameOrBefore(moment(maxDate, dateFormat)),
      errorMessage: maxDateError || 'The date is too late',
    });
  }

  return defaultRules;
};

const validator = (value: string, options: Options, userRules?: Rule[]): string | null => {
  const rules = userRules || getDefaultRules(value, options);
  for (let i = 0; i < rules.length; i++) {
    if (!rules[i].checker(value)) {
      return rules[i].errorMessage;
    }
  }
  return null;
};

export default validator;
