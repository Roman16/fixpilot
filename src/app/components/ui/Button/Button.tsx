import React from 'react';
import styles from './button.module.scss';
import clsx from 'clsx';
import {
    Trash,
    Pencil,
    Plus,
    Loader2,
    Save,
    Eye,
    Printer,
    DollarSign, UserRoundPlus, X, HousePlus
} from 'lucide-react';

type ButtonVariant = 'primary' | 'ghost';

type IconType = 'delete' | 'edit' | 'plus' | 'save' | 'eye' | 'print' | 'pay' | 'addUser' | 'close' | 'addVehicle';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
    iconType?: IconType;
}

const icons: Record<IconType, React.JSX.Element> = {
    delete: <Trash/>,
    edit: <Pencil/>,
    plus: <Plus/>,
    save: <Save/>,
    eye: <Eye/>,
    print: <Printer/>,
    pay: <DollarSign/>,
    addUser: <UserRoundPlus/>,
    addVehicle: <HousePlus/>,
    close: <X/>,
};

export const Button: React.FC<ButtonProps> = ({
                                                  variant = 'default',
                                                  iconType,
                                                  isLoading = false,
                                                  children,
                                                  className,
                                                  disabled,
                                                  ...rest
                                              }) => {
    const iconOnly = iconType && !children;

    return (
        <button
            className={clsx(
                styles.button,
                styles[variant],
                iconType && styles.withIcon,
                iconOnly && styles.iconOnly,
                className
            )}
            disabled={isLoading || disabled}
            {...rest}
        >
            {isLoading && <Loader2 className={styles.loader} size={16}/>}
            {iconType && icons[iconType]}
            {children}
        </button>
    );
};
