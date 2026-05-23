import styles from '../styles/form_field.module.css';

const iconMap = {
    error: 'error',
    success: 'check_circle',
    warning: 'warning',
    info: 'info'
};

const styleMap = {
    error: styles.validation_error,
    success: styles.validation_success,
    warning: styles.validation_warning,
    info: styles.validation_info
};

export default function ValidationMessage({ type = 'error', message }) {
    if (!message) return null;

    return (
        <div className={styleMap[type] || styleMap.error}>
            <span className={styles.validation_icon}>{iconMap[type] || 'error'}</span>
            <span>{message}</span>
        </div>
    );
}
