import React, {TextareaHTMLAttributes, useId} from 'react';
import styles from '../Input/input.module.scss';
import clsx from 'clsx';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
                                                      value,
                                                      onChange,
                                                      placeholder,
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

            <textarea
                className={clsx(styles.input, styles.textarea)}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                id={inputId}
                {...rest}
            />
        </div>
    );
};
