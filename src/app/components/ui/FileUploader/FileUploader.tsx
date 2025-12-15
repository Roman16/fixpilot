'use client';

import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './fileUploader.module.scss';
import {ImageUp} from "lucide-react";
import {Button} from "@/app/components/ui";

interface FileUploaderProps {
    value?: File | null;
    onChange: (file: File | null) => void;
    accept?: string[];
    label?: string;
    maxSizeMB?: number;
    className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
                                                              value,
                                                              onChange,
                                                              accept,
                                                              label,
                                                              maxSizeMB = 10,
                                                              className,
                                                          }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [drag, setDrag] = useState(false);

    const openFileDialog = () => inputRef.current?.click();

    const validateFile = useCallback(
        (file: File) => {
            setError(null);

            if (file.size > maxSizeMB * 1024 * 1024) {
                setError(`Максимальний розмір: ${maxSizeMB}MB`);
                return false;
            }

            if (accept?.length) {
                const valid = accept.some(format => {
                    if (format.includes("/*")) {
                        const base = format.split("/")[0];
                        return file.type.startsWith(base);
                    }
                    return file.name.toLowerCase().endsWith(format.toLowerCase());
                });

                if (!valid) {
                    setError("Формат файлу не дозволений");
                    return false;
                }
            }

            return true;
        },
        [accept, maxSizeMB]
    );

    const handleFile = (file: File) => {
        if (validateFile(file)) {
            onChange(file);
        }
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setError(null);
    };

    return (
        <div className={clsx(styles.wrapper, className)}>
            {label && <div className={styles.label}>{label}</div>}

            <div
                className={clsx(styles.inputWrapper, {[styles.drag]: drag})}
                onClick={openFileDialog}
                onDragEnter={() => setDrag(true)}
                onDragLeave={() => setDrag(false)}
                onDragOver={e => e.preventDefault()}
                onDrop={onDrop}
            >
                {value ? (
                    value.type.startsWith("image/") ? (
                        <div className={styles.previewWrapper}>
                            <img
                                src={URL.createObjectURL(value)}
                                alt="preview"
                                className={styles.previewImage}
                            />

                            <Button
                                iconType={'delete'}
                                type="button"
                                className={styles.removeBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(e);
                                }}
                            />
                        </div>
                    ) : (
                        <div className={styles.fileInfo}>
                            <span>{value.name}</span>

                            <Button
                                iconType={'delete'}
                                type="button"
                                className={styles.removeBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(e);
                                }}
                            />
                        </div>
                    )
                ) : (
                    <ImageUp/>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                className={styles.hiddenInput}
                accept={accept?.join(",")}
                onChange={onFileSelect}
            />

            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};
