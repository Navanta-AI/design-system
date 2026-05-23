import styles from '../../styles/modals.module.css';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, children, confirmText, cancelText }) {
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
                    <h3 className={styles.modal_title}>{title || 'Confirm'}</h3>
                    <span className={styles.modal_close} onClick={onClose}>close</span>
                </div>
                <div className={styles.modal_body}>
                    {children}
                </div>
                <div className={styles.modal_footer}>
                    <button className={styles.modal_btn_secondary} onClick={onClose}>
                        {cancelText || 'Cancel'}
                    </button>
                    <button className={styles.modal_btn_primary} onClick={onConfirm}>
                        {confirmText || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}
