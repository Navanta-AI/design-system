import { useState } from 'react';
import styles from '../../styles/checkboxes.module.css';

export default function DefaultCheckbox({ label, checked: controlledChecked, onChange, disabled, error, helperText }) {
    const [internalChecked, setInternalChecked] = useState(false);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    const handleClick = () => {
        if (disabled) return;
        if (isControlled && onChange) {
            onChange(!checked);
        } else {
            setInternalChecked(!internalChecked);
            if (onChange) onChange(!internalChecked);
        }
    };

    const getBoxClass = () => {
        if (disabled && checked) return styles.checkbox_box_disabled_checked;
        if (disabled) return styles.checkbox_box_disabled;
        if (error && checked) return styles.checkbox_box_error_checked;
        if (error) return styles.checkbox_box_error;
        if (checked) return styles.checkbox_box_checked;
        return styles.checkbox_box;
    };

    return (
        <div>
            <div
                className={disabled ? styles.checkbox_wrapper_disabled : styles.checkbox_wrapper}
                onClick={handleClick}
            >
                <div className={getBoxClass()}>
                    {checked && <span className={styles.checkmark}>check</span>}
                </div>
                {label && <span className={styles.checkbox_label}>{label}</span>}
            </div>
            {helperText && (
                <div className={error ? styles.helper_text_error : styles.helper_text}>
                    {helperText}
                </div>
            )}
        </div>
    );
}
