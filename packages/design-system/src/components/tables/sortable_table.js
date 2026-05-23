import { useState } from 'react';
import styles from '../../styles/tables.module.css';

export default function SortableTable({ columns, data }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    if (!columns || !data) return null;

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className={styles.table_wrapper}>
            <table className={styles.table}>
                <thead className={styles.table_header}>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i}>
                                <div
                                    className={styles.sortable_header}
                                    onClick={() => handleSort(col.key)}
                                >
                                    {col.label}
                                    <span className={sortKey === col.key ? styles.sort_icon_active : styles.sort_icon}>
                                        {sortKey === col.key && sortDir === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className={styles.table_empty}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((row, rowIndex) => (
                            <tr key={rowIndex} className={styles.table_row}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={styles.table_cell} data-label={col.label}>
                                        {row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
