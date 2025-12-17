"use client"
import {ReactNode} from "react";
import styles from './modal.module.scss'
import {useModalStore} from "@/store/modalStore";
import {X} from 'lucide-react';
import clsx from "clsx";

type ModalProps = {
    children: ReactNode;
    headerText?: ReactNode | string;
    className?: string;
}

export const Modal = ({
                          children,
                          headerText,
                          className
                      }: ModalProps) => {
    const {closeModal} = useModalStore();

    return (<div
        className={styles.overlay}
        onClick={() => closeModal()}
    >
        <div
            className={clsx(styles.modal, className)}
            onClick={(e) => e.stopPropagation()}
        >
            <button onClick={() => closeModal()} className={styles.closeBtn}>
                <X size={16}/>
            </button>

            {headerText && <div className={styles.header}>{headerText}</div>}

            <div className={styles.body}>
                {children}
            </div>
        </div>
    </div>)
}