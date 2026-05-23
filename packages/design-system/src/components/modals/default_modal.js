import styles from '../../styles/modals.module.css';

export default function DefaultModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose && onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.modal_header}>
                    <h3 className={styles.modal_title}>{title || 'Dialog'}</h3>
                    <span className={styles.modal_close} onClick={onClose}>close</span>
                </div>
                <div className={styles.modal_body}>
                    {children}
                </div>
            </div>
        </div>
    );
}
