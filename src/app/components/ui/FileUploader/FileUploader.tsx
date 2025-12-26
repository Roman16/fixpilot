'use client';

import React, {useEffect, useMemo, useRef} from 'react';
import clsx from 'clsx';
import styles from './fileUploader.module.scss';
import {ImageUp} from 'lucide-react';
import {Button} from '@/app/components/ui';
import {Loader} from '@/app/components/ui/Loader/Loader';

interface FileUploaderProps {
    file?: File | null;
    imageUrl?: string | null;
    onFileChange: (file: File | null) => void;
    onRemoveImage?: () => void;
    accept?: string[];
    label?: string;
    className?: string;
    isPending?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
                                                              file,
                                                              imageUrl,
                                                              onFileChange,
                                                              onRemoveImage,
                                                              accept,
                                                              label,
                                                              className,
                                                              isPending,
                                                          }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const previewUrl = useMemo(() => {
        if (!file) return null;
        return URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const openFileDialog = () => {
        if (!isPending) {
            inputRef.current?.click();
        }
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            onFileChange(selectedFile);
        }
    };

    const renderPreview = () => {
        if (file && previewUrl) {
            return (
                <Preview
                    src={previewUrl}
                    onRemove={() => onFileChange(null)}
                />
            );
        }

        if (imageUrl) {
            return (
                <Preview
                    src={imageUrl}
                    onRemove={onRemoveImage}
                />
            );
        }

        return <ImageUp />;
    };

    return (
        <div className={clsx(styles.wrapper, className)}>
            {label && <div className={styles.label}>{label}</div>}

            <div
                className={styles.inputWrapper}
                onClick={openFileDialog}
            >
                {renderPreview()}
                {isPending && <Loader className={styles.loader} />}
            </div>

            <input
                ref={inputRef}
                type="file"
                className={styles.hiddenInput}
                accept={accept?.join(',')}
                onChange={onFileSelect}
                disabled={isPending}
            />
        </div>
    );
};

/**
 * Preview sub-component
 */
const Preview = ({
                     src,
                     onRemove,
                 }: {
    src: string;
    onRemove?: () => void;
}) => (
    <div className={styles.previewWrapper}>
        <img
            src={src}
            alt="preview"
            className={styles.previewImage}
        />

        {onRemove && (
            <Button
                iconType="delete"
                type="button"
                className={styles.removeBtn}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
            />
        )}
    </div>
);
