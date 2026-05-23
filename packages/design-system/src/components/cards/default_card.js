import styles from '../../styles/cards.module.css';

export default function DefaultCard({ title, subtitle, children, actions }) {
    return (
        <div className={styles.card}>
            {(title || subtitle) && (
                <div className={styles.card_header}>
                    {title && <h3 className={styles.card_title}>{title}</h3>}
                    {subtitle && <p className={styles.card_subtitle}>{subtitle}</p>}
                </div>
            )}
            {children && <div className={styles.card_body}>{children}</div>}
            {actions && actions.length > 0 && (
                <>
                    <div className={styles.card_divider}></div>
                    <div className={styles.card_footer}>
                        {actions.map((action, i) => (
                            <span key={i} className={styles.card_action} onClick={action.onClick}>
                                {action.label}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
