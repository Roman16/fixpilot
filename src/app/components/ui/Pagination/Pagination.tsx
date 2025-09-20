import React from 'react';
import styles from './pagination.module.scss';
import clsx from 'clsx';
import { ChevronsLeft, ChevronsRight} from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
}

const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const Pagination: React.FC<PaginationProps> = ({
                                                          currentPage,
                                                          totalPages,
                                                          onPageChange,
                                                          siblingCount = 1,
                                                      }) => {
    if (totalPages <= 1) return null;

    const DOTS = '...';

    const generatePageNumbers = () => {
        const totalNumbers = siblingCount * 2 + 5;
        if (totalPages <= totalNumbers) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const showLeftDots = leftSiblingIndex > 2;
        const showRightDots = rightSiblingIndex < totalPages - 2;

        const firstPage = 1;
        const lastPage = totalPages;

        if (!showLeftDots && showRightDots) {
            const leftRange = range(1, 3 + 2 * siblingCount);
            return [...leftRange, DOTS, totalPages];
        }

        if (showLeftDots && !showRightDots) {
            const rightRange = range(totalPages - (2 + 2 * siblingCount), totalPages);
            return [firstPage, DOTS, ...rightRange];
        }

        const middleRange = range(leftSiblingIndex, rightSiblingIndex);
        return [firstPage, DOTS, ...middleRange, DOTS, lastPage];
    };

    const pages = generatePageNumbers();

    return (
        <div className={styles.pagination}>
            <button
                className={clsx(styles.page, styles.nav)}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronsLeft />
            </button>

            {pages.map((page, index) =>
                    page === DOTS ? (
                        <span key={index} className={styles.dots}>...</span>
                    ) : (
                        <button
                            key={page}
                            className={clsx(styles.page, {
                                [styles.active]: currentPage === page,
                            })}
                            onClick={() => onPageChange(Number(page))}
                        >
                            {page}
                        </button>
                    )
            )}

            <button
                className={clsx(styles.page, styles.nav)}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronsRight />
            </button>
        </div>
    );
};
