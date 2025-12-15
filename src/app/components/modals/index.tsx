'use client';

import {useModalStore} from '@/store/modalStore';
import {ClientModal} from '@/app/components/modals/ClientModal/ClientModal';
import {ConfirmActionModal} from "@/app/components/modals/ConfirmActionModal/ConfirmActionModal";
import {OrderModal} from "@/app/components/modals/OrderModal/OrderModal";
import {EmployeeModal} from "@/app/components/modals/EmployeeModal/EmployeeModal";
import {PayoutsModal} from "@/app/components/modals/PayoutsModal/PayoutsModal";

export const ModalContainer = () => {
    const {modal} = useModalStore();

    if (!modal) return null;

    const modals = {
        confirmAction: <ConfirmActionModal/>,
        clientModal: <ClientModal/>,
        orderModal: <OrderModal/>,
        employeeModal: <EmployeeModal/>,
        payoutsModal: <PayoutsModal/>
    };

    return modals[modal]
};
