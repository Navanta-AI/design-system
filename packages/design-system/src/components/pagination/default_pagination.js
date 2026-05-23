import styles from '../../styles/pagination.module.css';

export default function DefaultPagination({ currentPage, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className={styles.pagination}>
            <span
                className={currentPage <= 1 ? styles.nav_btn_disabled : styles.nav_btn}
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            >
                chevron_left
            </span>

            {getPageNumbers().map((page, i) =>
                page === '...' ? (
                    <span key={`dots-${i}`} className={styles.page_dots}>...</span>
                ) : (
                    <span
                        key={page}
                        className={page === currentPage ? styles.page_btn_active : styles.page_btn}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </span>
                )
            )}

            <span
                className={currentPage >= totalPages ? styles.nav_btn_disabled : styles.nav_btn}
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            >
                chevron_right
            </span>
        </div>
    );
}
