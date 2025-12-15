import React, {
    useState,
    useRef,
    useEffect,
    useCallback
} from 'react';
import clsx from 'clsx';
import styles from './select.module.scss';
import {Input} from '../Input/Input';

interface BaseOption {
    label: string;
    value: string;
}

export type Option<T = unknown> = BaseOption & T;

interface SelectProps<T> {
    label?: string;
    placeholder?: string;
    searchable?: boolean;
    options?: Array<Option<T>>;
    onChange: (value: string, opt: Option<T>) => void;
    className?: string;
    value?: string | null | undefined;
    optionRender?: (option: Option<T>) => React.ReactNode;
    onInputChange?: (text: string) => void;
    disabled?: boolean;
}

export function Select<T = unknown>({
                                        label,
                                        placeholder,
                                        searchable,
                                        options = [],
                                        className,
                                        value,
                                        disabled,

                                        onChange,
                                        optionRender,
                                        onInputChange
                                    }: SelectProps<T>) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleSelect = (newValue: string, opt: Option<T>) => {
        onChange(newValue, opt);
        const newLabel = options.find(i => i.value === newValue)?.label || "";
        setInputValue(newLabel);
        setOpen(false);
    };

    const handleInputChange = (text: string) => {
        setInputValue(text);
        onInputChange?.(text);
        if (!open) setOpen(true);
    };

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (!wrapperRef.current) return;

        if (!wrapperRef.current.contains(e.target as Node)) {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    useEffect(() => {
        const activeOption = options.find(i => i.value === value)

        if (activeOption) {
            setInputValue(activeOption.label)
        } else {
            if (value === null || value === undefined) {
                setInputValue('')
            } else {
                setInputValue(value)
            }
        }
    }, [value]);

    return (
        <div ref={wrapperRef} className={clsx(styles.wrapper, className)}>
            {label && <label className={styles.label}>{label}</label>}

            <div className={styles.fieldContainer}>
                <Input
                    autoComplete="off"
                    value={inputValue}
                    placeholder={placeholder}
                    readOnly={!searchable}
                    onClick={() => setOpen(prev => !prev)}
                    onChange={e => handleInputChange(e.target.value)}
                    disabled={disabled}
                />
                <ul className={clsx(styles.dropdown, {[styles.open]: open})}>
                    {options.map((opt: Option<T>) => (<li key={opt.value} onClick={() => handleSelect(opt.value, opt)}>
                        {optionRender ? optionRender(opt) : opt.label}
                    </li>))}
                </ul>
            </div>
        </div>
    );
}