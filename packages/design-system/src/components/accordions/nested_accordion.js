import { useState } from 'react';
import styles from '../../styles/accordions.module.css';

function AccordionNode({ item, depth = 0 }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div className={depth > 0 ? styles.nested_accordion : ''}>
            <div className={styles.accordion_item}>
                <div
                    className={isOpen ? styles.accordion_header_open : styles.accordion_header}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={styles.accordion_title}>{item.title}</span>
                    <span className={isOpen ? styles.accordion_icon_open : styles.accordion_icon}>
                        expand_more
                    </span>
                </div>
                <div className={`${styles.accordion_body} ${isOpen ? styles.accordion_body_open : ''}`}>
                    {item.content && (
                        <div className={styles.accordion_content}>{item.content}</div>
                    )}
                    {hasChildren && (
                        <div>
                            {item.children.map((child, i) => (
                                <AccordionNode key={i} item={child} depth={depth + 1} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function NestedAccordion({ items }) {
    if (!items) return null;

    return (
        <div className={styles.accordion}>
            {items.map((item, index) => (
                <AccordionNode key={index} item={item} depth={0} />
            ))}
        </div>
    );
}
