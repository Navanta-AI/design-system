import styles from '../styles/form_field.module.css';

export default function FormField({
    label,
    required,
    optional,
    error,
    success,
    helperText,
    charCount,
    maxChars,
    children
}) {
    const showError = error && !success;
    const showSuccess = success && !error;

    return (
        <div className={styles.form_field}>
            {label && (
                <div className={styles.label_row}>
                    <label className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                    {optional && <span className={styles.optional_text}>Optional</span>}
                </div>
            )}

            {children}

            <div className={styles.bottom_row}>
                <div>
                    {showError && (
                        <span className={styles.error_text}>
                            <span className={styles.validation_icon} style={{fontSize:"14px"}}>error</span>
                            {error}
                        </span>
                    )}
                    {showSuccess && (
                        <span className={styles.success_text}>
                            <span className={styles.validation_icon} style={{fontSize:"14px"}}>check_circle</span>
                            {success}
                        </span>
                    )}
                    {!showError && !showSuccess && helperText && (
                        <span className={styles.helper_text}>{helperText}</span>
                    )}
                </div>
                {maxChars !== undefined && (
                    <span className={charCount > maxChars ? styles.char_count_error : styles.char_count}>
                        {charCount || 0} / {maxChars}
                    </span>
                )}
            </div>
        </div>
    );
}
