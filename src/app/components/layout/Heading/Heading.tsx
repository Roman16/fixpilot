"use client"

import styles from './heading.module.scss';
import {Button} from "@/app/components/ui";
import {ModalState, useModalStore} from "@/store/modalStore";

interface IHeadingProps {
    title: string,
    actionType?: ModalState['modal'] | null,
    actionBtnText?: string,
}

export const Heading = ({
                            title,
                            actionType,
                            actionBtnText = 'Додати'
                        }: IHeadingProps) => {
    const openModal = useModalStore(state => state.openModal);

    return (<div className={styles.heading}>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.hr}/>

        {actionType && <Button
            className={styles.btn}
            iconType={'plus'}
            onClick={() => openModal(actionType)}
        >
            {actionBtnText}
        </Button>}
    </div>)
};