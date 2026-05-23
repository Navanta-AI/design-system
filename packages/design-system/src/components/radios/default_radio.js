import { useState } from 'react';
import styles from '../../styles/radios.module.css';

export default function DefaultRadio({ options, value: controlledValue, onChange, disabled, error, name, direction }) {
    const [internalValue, setInternalValue] = useState(null);
    const isControlled = controlledValue !== undefined;
    const selectedValue = isControlled ? controlledValue : internalValue;

    const handleSelect = (optionValue) => {
        if (disabled) return;
        if (isControlled && onChange) {
            onChange(optionValue);
        } else {
            setInternalValue(optionValue);
            if (onChange) onChange(optionValue);
        }
    };

    const getCircleClass = (optionValue) => {
        const isSelected = selectedValue === optionValue;
        if (disabled && isSelected) return styles.radio_circle_disabled_selected;
        if (disabled) return styles.radio_circle_disabled;
        if (error && isSelected) return styles.radio_circle_error_selected;
        if (error) return styles.radio_circle_error;
        if (isSelected) return styles.radio_circle_selected;
        return styles.radio_circle;
    };

    const getDotClass = () => {
        if (disabled) return styles.radio_dot_disabled;
        if (error) return styles.radio_dot_error;
        return styles.radio_dot;
    };

    return (
        <div className={direction === 'horizontal' ? styles.radio_group_horizontal : styles.radio_group}>
            {(options || []).map((option) => (
                <div
                    key={option.value}
                    className={disabled ? styles.radio_wrapper_disabled : styles.radio_wrapper}
                    onClick={() => handleSelect(option.value)}
                >
                    <div className={getCircleClass(option.value)}>
                        {selectedValue === option.value && <div className={getDotClass()} />}
                    </div>
                    <span className={styles.radio_label}>{option.label}</span>
                </div>
            ))}
        </div>
    );
}
