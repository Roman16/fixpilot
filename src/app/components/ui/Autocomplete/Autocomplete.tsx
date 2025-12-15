'use client';

import React, {useState, useRef, useEffect, ChangeEvent} from 'react';
import styles from './autocomplete.module.scss';
import {Input} from "@/app/components/ui";

interface AutocompleteProps<T> {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    suggestions: T[];
    disabled?: boolean;
    openOnFocus?: boolean;
    renderItem?: (item: T) => React.ReactNode;
    getItemValue?: (item: T) => string;
}

export const Autocomplete = <T extends any>({
                                                label,
                                                placeholder,
                                                value = '',
                                                onChange,
                                                suggestions,
                                                disabled = false,
                                                openOnFocus = false,
                                                getItemValue,
                                                renderItem
                                            }: AutocompleteProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = value
        ? suggestions.filter(item =>
            (getItemValue ? getItemValue(item) : String(item))
                .toLowerCase()
                .includes(value.toLowerCase())
        )
        : suggestions;

    const showList = isOpen && filtered.length > 0;

    const handleSelect = (item: T) => {
        onChange(getItemValue ? getItemValue(item) : String(item));
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className={styles.autocompleteWrapper}>
            <Input
                label={label}
                type="text"
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                className={styles.input}
                autoComplete="off"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onChange(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => {
                    if (openOnFocus) setIsOpen(true);
                }}
            />

            {showList && (
                <ul className={styles.suggestionsList}>
                    {filtered.map((item) => (
                        <li key={getItemValue ? getItemValue(item) : String(item)}
                            onMouseDown={() => handleSelect(item)}>
                            {renderItem ? renderItem(item) : (getItemValue ? getItemValue(item) : String(item))}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
