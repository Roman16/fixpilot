import {Modal} from "@/app/components/ui/Modal/Modal";
import {useModalStore} from "@/store/modalStore";
import styles from "./confirmActionModal.module.scss";
import {Button} from "@/app/components/ui";
import {FolderX} from "lucide-react";

export const ConfirmActionModal = () => {
    const closeConfirm = useModalStore(state => state.closeConfirm)
    const modalText = useModalStore(state => state.modalProps.text)
    const resolve = useModalStore(state => state.modalProps.resolve)


    const handleConfirm = () => {
        resolve?.(true);
        closeConfirm();
    };

    const handleCancel = () => {
        resolve?.(false);
        closeConfirm();
    };

    return (<Modal className={styles.modal}>
        <div className={styles.text}>
            <FolderX />

            {modalText}
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