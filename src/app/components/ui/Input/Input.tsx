import React, {InputHTMLAttributes, useId, useState} from 'react';
import styles from './input.module.scss';
import clsx from 'clsx';
import {Eye, EyeOff} from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    suffix?: React.ReactNode;
    error?: string;
    withPasswordToggle?: boolean;
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
                                                error,
                                                withPasswordToggle = false,
                                                ...rest
                                            }) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password" && withPasswordToggle;
    const inputType = isPassword && showPassword ? "text" : type;

    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className={clsx(styles.inputWrapper, className, {[styles.error]: !!error})}>
            {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}

            <div className={styles.inputInner}>
                <input
                    className={styles.input}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    id={inputId}
                    {...rest}
                />

                {isPassword && (
                    <button
                        type="button"
                        className={styles.eye}
                        onClick={() => setShowPassword(v => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <Eye/> : <EyeOff/>}
                    </button>
                )}

                {!isPassword && suffix && (
                    <div className={styles.suffix}>{suffix}</div>
                )}
            </div>

            {error && (
                <span className={styles.errorText}>
                    {error}
                </span>
            )}
        </div>
    );
};
