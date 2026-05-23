import { useState } from 'react';
import styles from '../../styles/accordions.module.css';

export default function DefaultAccordion({ items, allowMultiple }) {
    const [openItems, setOpenItems] = useState([]);

    if (!items) return null;

    const toggleItem = (index) => {
        if (allowMultiple) {
            setOpenItems((prev) =>
                prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
            );
        } else {
            setOpenItems((prev) =>
                prev.includes(index) ? [] : [index]
            );
        }
    };

    return (
        <div className={styles.accordion}>
            {items.map((item, index) => {
                const isOpen = openItems.includes(index);
                return (
                    <div key={index} className={styles.accordion_item}>
                        <div
                            className={isOpen ? styles.accordion_header_open : styles.accordion_header}
                            onClick={() => toggleItem(index)}
                        >
                            <span className={styles.accordion_title}>{item.title}</span>
                            <span className={isOpen ? styles.accordion_icon_open : styles.accordion_icon}>
                                expand_more
                            </span>
                        </div>
                        <div className={`${styles.accordion_body} ${isOpen ? styles.accordion_body_open : ''}`}>
                            <div className={styles.accordion_content}>
                                {item.content}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
