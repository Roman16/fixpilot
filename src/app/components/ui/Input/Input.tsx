import React, {InputHTMLAttributes,TextareaHTMLAttributes, useId} from 'react';
import styles from './input.module.scss';
import clsx from "clsx";

type CommonInputProps = InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>;

export interface InputProps extends CommonInputProps {
    label?: string;
    as?: 'input' | 'textarea';
}

export const Input: React.FC<InputProps> = ({
                                                value,
                                                onChange,
                                                placeholder,
                                                type = 'text',
                                                label,
                                                id,
                                                className,
                                                ...rest
                                            }) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className={clsx(styles.inputWrapper, className)}>
            {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}

            {type === 'multitext' ? <textarea
                className={clsx(styles.input, styles.textarea)}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                id={inputId}
                {...rest}
            /> : <input
                className={styles.input}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                id={inputId}
                {...rest}
            />}

        </div>

    );
};

