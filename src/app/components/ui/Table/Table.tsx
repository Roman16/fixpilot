'use client';
import {ReactNode, useRef, useState, FC} from 'react';
import styles from './table.module.scss';
import {Pagination} from "@/app/components/ui/Pagination/Pagination";
import {Loader} from "@/app/components/ui/Loader/Loader";
import {Input} from "@/app/components/ui";
import clsx from "clsx";

export interface Column<T> {
    key: string;
    label?: string;
    render?: (value: any, row: T) => ReactNode;
    className?: string;
    width?: string;
    minWidth?: string;
    align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    rowKey: (row: T) => string | number;
    emptyText?: string;
    searchPlaceholder?: string;
    isLoading?: boolean;
    searchable?: boolean;
    onSearch?: (value: string) => void;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    },
    expandable?: {
        isRowExpandable?: (row: T) => boolean;
        renderExpanded: (row: T) => ReactNode;
        expandOnRowClick?: boolean;
        singleExpand?: boolean;
    }
}

export function Table<T>({
                             columns,
                             data = [],
                             rowKey,
                             emptyText = 'Немає даних для відображення',
                             isLoading = false,
                             pagination,
                             searchable = false,
                             searchPlaceholder,
                             onSearch,
                             expandable
                         }: TableProps<T>) {

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());

    const toggleRow = (key: string | number) => {
        setExpandedRows(prev => {
            const next = new Set(prev);

            if (expandable?.singleExpand) {
                if (next.has(key)) {
                    next.delete(key);
                } else {
                    next.clear();
                    next.add(key);
                }
            } else {
                next.has(key) ? next.delete(key) : next.add(key);
            }

            return next;
        });
    };


    const handleSearch = (value: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            onSearch && onSearch(value);
        }, 500);
    };

    return (
        <div className={styles.tableWrapper}>
            {searchable && <div className={styles.searchBar}>
              <Input
                className={styles.field}
                placeholder={searchPlaceholder}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>}

            <div className={styles.table}>
                {/* Header */}
                <div className={clsx(styles.thead, {
                    [styles.expandableThead]: !!expandable
                })}>
                    {columns.map((col) => (
                        <div
                            key={col.key}
                            className={`${styles.th} ${col.className || ''} ${col?.align === 'center' ? styles.center : ''} ${col?.align === 'right' ? styles.right : ''}`}
                            style={{
                                ...(col.width && {maxWidth: col.width}),
                                ...(col.minWidth && {minWidth: col.minWidth})
                            }}
                        >
                            {col.label}
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className={styles.tbody}>
                    {data.length === 0 && !isLoading ? (
                        <div className={styles.emptyRow} style={{gridColumn: `span ${columns.length}`}}>
                            {emptyText}
                        </div>
                    ) : (
                        data.map((row) => {
                            const key = rowKey(row);
                            const isExpanded = expandedRows.has(key);
                            const canExpand = expandable?.isRowExpandable?.(row) ?? true;

                            return (
                                <div key={key}>
                                    {/* Основний рядок */}
                                    <div
                                        className={clsx(styles.trow, {
                                            [styles.isExpanded]: isExpanded,
                                            [styles.canExpand]: canExpand,
                                        })}
                                        onClick={() => {
                                            if (expandable?.expandOnRowClick && canExpand) {
                                                toggleRow(key);
                                            }
                                        }}
                                    >
                                        {expandable && <Arrow />}

                                        {columns.map((col) => (
                                            <div
                                                key={col.key}
                                                className={`${styles.td} ${col.className || ''} ${col?.align === 'center' ? styles.center : ''} ${col?.align === 'right' ? styles.right : ''}`}
                                                style={{
                                                    ...(col.width && {maxWidth: col.width}),
                                                    ...(col.minWidth && {minWidth: col.minWidth})
                                                }}
                                            >
                                                {col.render
                                                    ? col.render(row[col.key as keyof T], row)
                                                    : String(row[col.key as keyof T] ?? '')
                                                }
                                            </div>
                                        ))}
                                    </div>

                                    {/* Підтаблиця */}
                                    {expandable && isExpanded && (
                                        <div
                                            className={styles.expandedRow}
                                            style={{gridColumn: `span ${columns.length}`}}
                                        >
                                            {expandable.renderExpanded(row)}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {pagination && <div className={styles.pagination}><Pagination {...pagination}/></div>}

            {isLoading && (
                <div className={styles.loader}>
                    <Loader/>
                </div>
            )}
        </div>
    );
}

const Arrow = () => <div className={styles.arrow}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chevron-right h-4 w-4"
         aria-hidden="true" data-replit-metadata="client/src/pages/Clients.tsx:247:76"
         data-component-name="ChevronRight">
        <path d="m9 18 6-6-6-6"></path>
    </svg>
</div>