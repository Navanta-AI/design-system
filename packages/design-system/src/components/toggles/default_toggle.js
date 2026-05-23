import { useState } from 'react';
import styles from '../../styles/toggles.module.css';

export default function DefaultToggle({ label, checked: controlledChecked, onChange, disabled }) {
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

    const getTrackClass = () => {
        if (disabled && checked) return styles.toggle_track_disabled_on;
        if (disabled) return styles.toggle_track_disabled;
        if (checked) return styles.toggle_track_on;
        return styles.toggle_track;
    };

    return (
        <div
            className={disabled ? styles.toggle_wrapper_disabled : styles.toggle_wrapper}
            onClick={handleClick}
        >
            <div className={getTrackClass()}>
                <div className={checked ? styles.toggle_thumb_on : styles.toggle_thumb} />
            </div>
            {label && <span className={styles.toggle_label}>{label}</span>}
        </div>
    );
}
