import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faMeh, faSmile, faGrin, faAngry, IconDefinition } from '@fortawesome/free-solid-svg-icons';

const customIcons: { [index: string]: { icon: IconDefinition; label: string; color: string } } = {
  1: {
    icon: faAngry,
    label: 'Poor',
    color: 'red',
  },
  2: {
    icon: faFrown,
    label: 'Average',
    color: 'orange',
  },
  3: {
    icon: faMeh,
    label: 'Good',
    color: '#fff01a',
  },
  4: {
    icon: faSmile,
    label: 'Very Good',
    color: 'lightgreen',
  },
  5: {
    icon: faGrin,
    label: 'Excellent',
    color: 'green',
  },
};

interface RadioGroupRatingProps {
  value?: string;
  onChange?: (value: string) => void;
}

const RadioGroupRating: React.FC<RadioGroupRatingProps> = ({ value, onChange }) => {
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
  });

  const getLabelStyle = (isSelected: boolean) => ({
    marginLeft: isSelected ? '15px' : 0,
    transition: 'transform 0.3s, background-color 0.3s',
    transform: isSelected ? 'scale(1.3)' : 'scale(1)',
    fontWeight: 500,
    fontFamily: 'cursive',
    cursor: 'pointer',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        // gap: '60px',
        // margin: '35px 0 45px',
        height: 130,
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
              gap: '8px',
              height: '100%',
              width: '200px',
            }}
            key={key}
            onClick={() => handleClick(key)}
          >
            <div style={getStyle(isSelected, color)} title={label}>
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
