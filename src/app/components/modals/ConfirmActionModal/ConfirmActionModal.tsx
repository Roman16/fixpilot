import {Modal} from "@/app/components/ui/Modal/Modal";
import {useModalStore} from "@/store/modalStore";
import styles from "./confirmActionModal.module.scss";
import {Button} from "@/app/components/ui";
import {FolderX} from "lucide-react";
import {FC, ReactNode} from "react";

interface ConfirmActionModalProps {
    modalId: string ;
    modalProps: {
        text: string | ReactNode | undefined;
        resolve: (value: boolean) => void;
    }
}

export const ConfirmActionModal: FC<ConfirmActionModalProps> = ({modalProps, modalId}) => {
    const closeConfirm = useModalStore(state => state.closeConfirm)

    const handleConfirm = () => {
        modalProps.resolve?.(true);
        closeConfirm(modalId);
    };

    const handleCancel = () => {
        modalProps.resolve?.(false);
        closeConfirm(modalId);
    };

    return (<Modal className={styles.modal}>
        <div className={styles.text}>
            <FolderX />

            {modalProps.text}
        </div>

        <div className={styles.actions}>
            <Button
                type={'button'}
                onClick={handleCancel}
            >
                Скасувати
            </Button>

            <Button
                type="submit"
                variant={'primary'}
                onClick={handleConfirm}
            >
                Підтвердити
            </Button>
        </div>
    </Modal>)
}