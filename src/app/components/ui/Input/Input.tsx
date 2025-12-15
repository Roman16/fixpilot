import React, {InputHTMLAttributes, useId} from 'react';
import styles from './input.module.scss';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    suffix?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
                                                value,
                                                onChange,
                                                placeholder,
                                                type = 'text',
                                                label,
                                                id,
                                                className,
                                                suffix,
                                                ...rest
                                            }) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className={clsx(styles.inputWrapper, className)}>
            {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}

            <div className={styles.inputInner}>
                <input
                    className={styles.input}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    id={inputId}
                    {...rest}
                />

                {suffix && (
                    <div className={styles.suffix}>
                        {suffix}
                    </div>
                )}
            </div>
        </div>
    );
};
