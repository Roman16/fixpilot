'use client';
import {ReactNode} from 'react';
import styles from './table.module.scss';
import {Loader2} from "lucide-react";

export interface Column<T> {
    key: string;
    label: string;
    render?: (value: any, row?: T) => ReactNode;
    className?: string;
    width?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    rowKey: (row: T) => string | number;
    emptyText?: string;
    isLoading?: boolean;
}

export function Table<T>({
                             columns,
                             data = [],
                             rowKey,
                             emptyText = 'Немає даних для відображення',
                             isLoading = false,
                         }: TableProps<T>) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                <tr>
                    {columns.map((col) => (
                        <th
                            key={String(col.key)}
                            className={`${styles.th} ${col.className || ''}`}
                            style={col.width ? { width: col.width } : undefined}
                        >
                            {col.label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className={styles.tbody}>
                {!isLoading && data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} className={styles.emptyRow}>
                            {emptyText}
                        </td>
                    </tr>
                ) : (
                    data.map((row) => (
                        <tr key={rowKey(row)} className={styles.rowHover}>
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={`${styles.td} ${col.className || ''}`}
                                    style={col.width ? { width: col.width } : undefined}
                                >
                                    {col.render
                                        ? col.render(row[col.key as keyof T], row)
                                        : String(row[col.key as keyof T] ?? '')
                                    }
                                </td>
                            ))}
                        </tr>
                    ))
                )}
                </tbody>
                {isLoading && <div className={styles.loader}><Loader2/></div>}
            </table>
        </div>
    );
}
