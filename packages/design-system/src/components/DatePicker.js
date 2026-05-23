import React, { useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import { FiCalendar } from 'react-icons/fi';
import styles from '../styles/DatePicker.module.css';
import inputStyles from '../styles/inputs.module.css';

/**
 * DatePicker component for selecting a single date.
 * 
 * @param {Object} props
 * @param {Date} props.value - Selected date.
 * @param {Function} props.onChange - Callback when date is selected.
 * @param {string} props.placeholder - Placeholder text.
 * @param {boolean} props.disabled - Whether interaction is disabled.
 * @param {boolean} props.error - Error state.
 */
export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  error = false
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date) => {
    onChange(date);
    setIsOpen(false);
  };

  const displayValue = value ? format(value, 'PPP') : '';

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <div className={styles.triggerWrapper}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              readOnly
              value={displayValue}
              placeholder={placeholder}
              disabled={disabled}
              className={`${inputStyles.inputField} ${error ? inputStyles.inputField_error : ''} ${disabled ? inputStyles.inputField_disable : ''}`}
              style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            />
            <FiCalendar className={styles.icon} />
          </div>
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content 
          className={styles.content} 
          sideOffset={5}
          align="start"
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleSelect}
            captionLayout="dropdown"
            startMonth={new Date(1925, 0)}
            endMonth={new Date(2035, 11)}
            className={styles.calendar}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
