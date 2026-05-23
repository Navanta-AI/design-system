import styles from '../../styles/pagination.module.css';

export default function CompactPagination({ currentPage, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <div className={styles.compact_pagination}>
            <span
                className={currentPage <= 1 ? styles.nav_btn_disabled : styles.nav_btn}
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            >
                chevron_left
            </span>
            <span className={styles.compact_text}>
                {currentPage} of {totalPages}
            </span>
            <span
                className={currentPage >= totalPages ? styles.nav_btn_disabled : styles.nav_btn}
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            >
                chevron_right
            </span>
        </div>
    );
}
