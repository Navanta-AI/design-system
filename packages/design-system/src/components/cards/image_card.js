import styles from '../../styles/cards.module.css';

export default function ImageCard({ title, subtitle, imageSrc, imageAlt, children, actions }) {
    return (
        <div className={styles.card}>
            {imageSrc ? (
                <div className={styles.card_image_wrapper}>
                    <img
                        className={styles.card_image}
                        src={imageSrc}
                        alt={imageAlt || ''}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                </div>
            ) : (
                <div className={styles.card_image_placeholder}>
                    <span className={styles.material_icons} style={{fontSize:"48px"}}>image</span>
                </div>
            )}
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
