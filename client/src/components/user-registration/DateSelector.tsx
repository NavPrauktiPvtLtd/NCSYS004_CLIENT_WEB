import useClickSound from '@/hooks/useClickSound';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const generateDays = (month: number, year: number) => {
  if (month === 2) {
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return Array.from({ length: isLeapYear ? 29 : 28 }, (_, i) => i + 1);
  }
  const daysInMonth = [31, 30, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return Array.from({ length: daysInMonth[month - 1] }, (_, i) => i + 1);
};

const generateYears = () => {
  const startYear = 1924;
  const endYear = new Date().getFullYear();
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => String(endYear - i));
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface DateSelectorProps {
  onDateChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateChange }) => {
  const [selectedYear, setSelectedYear] = useState<number | string>('');
  const [selectedMonth, setSelectedMonth] = useState<number | string>('');
  const [selectedDay, setSelectedDay] = useState<number | string>('');
  const [days, setDays] = useState<number[]>([]); // No days initially
  const years = generateYears();
  const { playClickSound } = useClickSound();

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      setDays(generateDays(Number(selectedMonth), Number(selectedYear)));
      setSelectedDay(''); // Reset day when month or year changes
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      onDateChange(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`);
    }
  }, [selectedMonth, selectedDay, selectedYear, onDateChange]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    playClickSound();
    setSelectedMonth('');
    setSelectedDay('');
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedYear) {
      toast.error('Please select a year first');
      return;
    }
    setSelectedMonth(e.target.value);
    playClickSound();
    setSelectedDay('');
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedMonth) {
      toast.error('Please select a month first');
      return;
    }
    setSelectedDay(e.target.value);
    playClickSound();
  };

  return (
    <div>
      <select
        value={selectedYear}
        onChange={handleYearChange}
        style={{
          height: '34px',
          paddingRight: '5px',
          paddingLeft: '5px',
          borderTopLeftRadius: '5px',
          borderBottomLeftRadius: '5px',
          borderColor: '#00000025',
          borderRight: 0,
          fontFamily: 'sans-serif',
          fontSize: '14px',
        }}
      >
        <option value="" style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
          Year
        </option>
        {years.map(year => (
          <option key={year} value={year} style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
            {year}
          </option>
        ))}
      </select>
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        style={{
          height: '34px',
          paddingRight: '5px',
          paddingLeft: '5px',
          borderColor: '#00000025',
          fontFamily: 'sans-serif',
          fontSize: '14px',
        }}
      >
        <option value="" style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
          Month
        </option>
        {months.map((month, index) => (
          <option key={index} value={index + 1} style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
            {month}
          </option>
        ))}
      </select>
      <select
        value={selectedDay}
        onChange={handleDayChange}
        style={{
          height: '34px',
          paddingRight: '5px',
          paddingLeft: '5px',
          borderColor: '#00000025',
          borderTopRightRadius: '5px',
          borderBottomRightRadius: '5px',
          borderLeft: 0,
          fontFamily: 'sans-serif',
          fontSize: '14px',
        }}
      >
        <option value="" style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
          Day
        </option>
        {days.map(day => (
          <option key={day} value={day} style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
            {day}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;
