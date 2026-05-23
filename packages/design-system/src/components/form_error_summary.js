import styles from '../styles/form_field.module.css';

export default function FormErrorSummary({ title, errors, onErrorClick }) {
    if (!errors || errors.length === 0) return null;

    return (
        <div className={styles.error_summary}>
            <div className={styles.error_summary_title}>
                <span className={styles.validation_icon}>error</span>
                {title || `There are ${errors.length} errors in this form`}
            </div>
            <ul className={styles.error_summary_list}>
                {errors.map((err, index) => (
                    <li
                        key={index}
                        className={styles.error_summary_item}
                        onClick={() => onErrorClick && onErrorClick(err.field)}
                    >
                        <span className={styles.error_summary_bullet}></span>
                        {err.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}
