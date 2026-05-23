import styles from '../../styles/tables.module.css';

export default function DefaultTable({ columns, data, striped }) {
    if (!columns || !data) return null;

    return (
        <div className={styles.table_wrapper}>
            <table className={styles.table}>
                <thead className={styles.table_header}>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className={styles.table_empty}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className={striped ? styles.table_row_striped : styles.table_row}>
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
