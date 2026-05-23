import styles from '../../styles/toasts.module.css';
import DefaultToast from './default_toast';

export default function ToastContainer({ toasts = [], onRemove }) {
    if (toasts.length === 0) return null;

    return (
        <div className={styles.toast_container}>
            {toasts.map((toast) => (
                <DefaultToast
                    key={toast.id}
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={() => onRemove && onRemove(toast.id)}
                />
            ))}
        </div>
    );
}
