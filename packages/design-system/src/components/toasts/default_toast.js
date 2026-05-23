import { useState, useEffect, useCallback } from 'react';
import styles from '../../styles/toasts.module.css';

const iconMap = {
    info: 'info',
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
};

const styleMap = {
    info: styles.toast_info,
    success: styles.toast_success,
    error: styles.toast_error,
    warning: styles.toast_warning,
};

export default function DefaultToast({ type = 'info', title, message, onClose, duration = 5000 }) {
    const [exiting, setExiting] = useState(false);

    const handleClose = useCallback(() => {
        setExiting(true);
        setTimeout(() => {
            onClose && onClose();
        }, 250);
    }, [onClose]);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, handleClose]);

    return (
        <div className={`${styleMap[type] || styleMap.info} ${exiting ? styles.toast_exiting : ''}`}>
            <span className={styles.toast_icon}>{iconMap[type] || 'info'}</span>
            <div className={styles.toast_content}>
                {title && <div className={styles.toast_title}>{title}</div>}
                {message && <div className={styles.toast_message}>{message}</div>}
            </div>
            <span className={styles.toast_close} onClick={handleClose}>close</span>
        </div>
    );
}
