import React, { useState, useRef, useEffect, FocusEvent, KeyboardEvent } from 'react';
import DateOps from './DateOps';
import validator from './validator';
import './style/DateInput.css';
import toast from 'react-hot-toast';

interface DateInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  minDate?: string;
  minDateError?: string;
  maxDate?: string;
  maxDateError?: string;
  invalidError?: string;
  disabled?: boolean;
  shouldValidate?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  id,
  value,
  onChange,
  onBlur,
  minDate,
  minDateError,
  maxDate,
  maxDateError,
  invalidError,
  disabled,
  shouldValidate,
}) => {
  const dayInput = useRef<HTMLInputElement>(null);
  const monthInput = useRef<HTMLInputElement>(null);
  const yearInput = useRef<HTMLInputElement>(null);

  const parseDate = (value?: string) => {
    console.log(value);
    if (value !== undefined && value.match(/\d{0,2}-\d{0,2}-\d{0,4}/)) {
      const dateArray = value.split('-');
      console.log(dateArray);
      return {
        day: dateArray[0],
        month: dateArray[1],
        year: dateArray[2],
        value: value,
        error: false,
        errorMessage: '',
      };
    }

    return {
      year: '',
      month: '',
      day: '',
      value: '',
      error: false,
      errorMessage: '',
    };
  };

  const [dateState, setDateState] = useState({
    year: '',
    month: '',
    day: '',
    value: '',
    error: false,
    errorMessage: '',
  });

  const [d, setD] = useState('');
  const [m, setM] = useState('');
  const [y, setY] = useState('');

  useEffect(() => {
    if (dateState.day) {
      setD(dateState.day);
    }
    if (dateState.month) {
      setM(dateState.month);
    }
    if (dateState.year) {
      setY(dateState.year);
    }
  }, [dateState]);

  useEffect(() => {
    if (value) {
      setDateState(parseDate(value));
    }
  }, [value]);

  console.log(dateState);

  const correctValue = (dateProp: 'day' | 'month' | 'year', value: string): string => {
    switch (dateProp) {
      case 'day':
        return value > '31' ? '31' : value;
      case 'month':
        return value > '12' ? '12' : value;
      default:
        return value;
    }
  };

  const updateDate = (dateProp: 'day' | 'month' | 'year', value: string) => {
    if (value !== '' && !value.match(/^\d+$/)) {
      return;
    }

    console.log(value);

    const correctedValue = correctValue(dateProp, value);
    const newState = { ...dateState, [dateProp]: correctedValue };

    const dayFocused = dayInput.current === document.activeElement;
    const monthFocused = monthInput.current === document.activeElement;
    const yearFocused = yearInput.current === document.activeElement;

    const dayValue = dayFocused ? newState.day : DateOps.padSingleDigit(newState.day);
    const monthValue = monthFocused ? newState.month : DateOps.padSingleDigit(newState.month);
    const yearValue = yearFocused ? newState.year : newState.year;

    const dateValue = `${dayValue}-${monthValue}-${yearValue}`;

    setDateState({
      year: yearValue,
      month: monthValue,
      day: dayValue,
      value: dateValue,
      error: false,
      errorMessage: '',
    });

    onChange(dateValue);
    if (dateValue.length === 10 && shouldValidate) {
      validate(dateValue);
    }
  };

  const handleFocus = (dateProp: 'day' | 'month' | 'year', value: string) => {
    if (dateProp === 'year') {
      return;
    }

    console.log('HandleFocus', value);

    const dayFocused = dayInput.current === document.activeElement;
    const monthFocused = monthInput.current === document.activeElement;

    if (dayFocused && value.length >= 2) {
      monthInput.current?.focus();
    } else if (monthFocused && value.length >= 2) {
      yearInput.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, dateProp: 'day' | 'month' | 'year') => {
    const isBackspace = e.key === 'Backspace';

    if (isBackspace) {
      if (dateProp === 'month' && monthInput.current?.value === '') {
        dayInput.current?.focus();
      } else if (dateProp === 'year' && yearInput.current?.value === '') {
        monthInput.current?.focus();
      }
    } else {
      const nextInput = dateProp === 'day' ? monthInput.current : dateProp === 'month' ? yearInput.current : null;
      if (nextInput && e.currentTarget.value.length >= e.currentTarget.maxLength) {
        nextInput.focus();
      }
    }
  };

  const onChangeHandler = (dateProp: 'day' | 'month' | 'year', value: string) => {
    if (dateProp === 'day') setD(value);
    if (dateProp === 'month') setM(value);
    if (dateProp === 'year') setY(value);
    updateDate(dateProp, value);
    handleFocus(dateProp, value);
  };

  const validate = (dateValue: string) => {
    const errorMsg = validator(dateValue, { minDate, maxDate, invalidError, minDateError, maxDateError });
    if (errorMsg) {
      setDateState(prevState => ({ ...prevState, error: true, errorMessage: errorMsg }));
    } else {
      setDateState(prevState => ({ ...prevState, error: false }));
    }
  };

  const onBlurHandler = (e: FocusEvent<HTMLDivElement>) => {
    const currentTarget = e.currentTarget;

    const dayValue = DateOps.padSingleDigit(dateState.day);
    const monthValue = DateOps.padSingleDigit(dateState.month);
    const yearValue = dateState.year;

    const currentValue = `${dayValue}-${monthValue}-${yearValue}`;

    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        if (shouldValidate) {
          validate(currentValue);
        }
        if (dateState.value !== currentValue) {
          onChange(currentValue);
        }
        if (onBlur) {
          onBlur(currentValue);
        }
      }
    });
  };

  useEffect(() => {
    if (dateState.error && dateState.errorMessage) {
      toast.error(dateState.errorMessage || 'Please enter a valid date!');
    }
  }, [dateState.error, dateState.errorMessage]);

  return (
    <div>
      <div className={`${dateState.error ? 'is-invalid' : ''} outline-container`} onBlur={onBlurHandler}>
        <div id="day-container" className="date--input-container">
          <input
            id={`${id}-day`}
            ref={dayInput}
            placeholder="dd"
            type="tel"
            maxLength={2}
            className="date--input"
            value={d}
            onChange={e => onChangeHandler('day', e.target.value)}
            onKeyDown={e => handleKeyDown(e, 'day')}
            onBlur={e => updateDate('day', e.target.value)}
            disabled={disabled}
          />
          <span className="date--separator">/</span>
        </div>
        <div id="month-container" className="date--input-container">
          <input
            id={`${id}-month`}
            ref={monthInput}
            placeholder="mm"
            type="tel"
            maxLength={2}
            className="date--input"
            value={m}
            onChange={e => onChangeHandler('month', e.target.value)}
            onKeyDown={e => handleKeyDown(e, 'month')}
            onBlur={e => updateDate('month', e.target.value)}
            disabled={disabled}
          />
          <span className="date--separator">/</span>
        </div>
        <div id="year-container" className="date--input-container">
          <input
            id={`${id}-year`}
            ref={yearInput}
            placeholder="yyyy"
            type="tel"
            maxLength={4}
            className="date--input"
            value={y}
            onChange={e => onChangeHandler('year', e.target.value)}
            onKeyDown={e => handleKeyDown(e, 'year')}
            onBlur={e => updateDate('year', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default DateInput;
