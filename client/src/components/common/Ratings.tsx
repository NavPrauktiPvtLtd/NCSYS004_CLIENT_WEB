import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faMeh, faSmile, faGrin, faAngry, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store/store';

interface RadioGroupRatingProps {
  value?: string;
  onChange?: (value: string) => void;
}

const RadioGroupRating: React.FC<RadioGroupRatingProps> = ({ value, onChange }) => {
  const { language } = useAuthStore();

  const customIcons: { [index: string]: { icon: IconDefinition; label: string | JSX.Element; color: string } } = {
    1: {
      icon: faAngry,
      label: language === 'English' ? 'Poor' : <span style={{ fontFamily: 'Banikanta' }}>বেয়া</span>,
      color: 'red',
    },
    2: {
      icon: faFrown,
      label: language === 'English' ? 'Average' : <span style={{ fontFamily: 'Banikanta' }}>আংশিকভাৱে ভাল</span>,
      color: 'orange',
    },
    3: {
      icon: faMeh,
      label: language === 'English' ? 'Good' : <span style={{ fontFamily: 'Banikanta' }}>ভাল</span>,
      color: '#fff01a',
    },
    4: {
      icon: faSmile,
      label: language === 'English' ? 'Very Good' : <span style={{ fontFamily: 'Banikanta' }}>বৰ ভাল</span>,
      color: 'lightgreen',
    },
    5: {
      icon: faGrin,
      label: language === 'English' ? 'Excellent' : <span style={{ fontFamily: 'Banikanta' }}>খুব ভাল</span>,
      color: 'green',
    },
  };

  const handleClick = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const getStyle = (isSelected: boolean, color: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 5px',
    cursor: 'pointer',
    border: isSelected ? `2px solid ${color}` : '',
    borderRadius: '50%',
    padding: '5px',
    transition: 'transform 0.3s, background-color 0.3s',
    backgroundColor: isSelected ? 'white' : 'transparent',
    transform: isSelected ? 'scale(1.3)' : 'scale(1)',
    fontSize: '1.3rem',
  });

  const getLabelStyle = (isSelected: boolean) => ({
    marginLeft: isSelected ? '15px' : 0,
    transition: 'transform 0.3s, background-color 0.3s',
    transform: isSelected ? 'scale(1.3)' : 'scale(1)',
    fontWeight: 500,
    fontFamily: 'cursive',
    cursor: 'pointer',
    fontSize: '1.5rem',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 130,
        gap: '50px',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {Object.keys(customIcons).map(key => {
        const { icon, label, color } = customIcons[key];
        const isSelected = value === key;
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              height: '100%',
              width: '200px',
            }}
            key={key}
            onClick={() => handleClick(key)}
          >
            <div style={getStyle(isSelected, color)}>
              <FontAwesomeIcon icon={icon} size="3x" color={color} />
            </div>
            <div style={getLabelStyle(isSelected)}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default RadioGroupRating;
