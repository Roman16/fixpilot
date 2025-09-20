'use client';

import {useModalStore} from '@/store/modalStore';
import {ClientModal} from '@/app/components/modals/ClientModal/ClientModal';
import {ConfirmActionModal} from "@/app/components/modals/ConfirmActionModal/ConfirmActionModal";

export const ModalContainer = () => {
    const {modal} = useModalStore();

    if (!modal) return null;

    const modals = {
        clientModal: <ClientModal/>,
        confirmAction: <ConfirmActionModal/>
    };

    return modals[modal]
};
