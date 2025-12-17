'use client';

import {useModalStore} from '@/store/modalStore';
import {ClientModal} from '@/app/components/modals/ClientModal/ClientModal';
import {ConfirmActionModal} from "@/app/components/modals/ConfirmActionModal/ConfirmActionModal";
import {OrderModal} from "@/app/components/modals/OrderModal/OrderModal";
import {EmployeeModal} from "@/app/components/modals/EmployeeModal/EmployeeModal";
import {PayoutsModal} from "@/app/components/modals/PayoutsModal/PayoutsModal";

const modalMap = {
    confirmAction: ConfirmActionModal,
    clientModal: ClientModal,
    orderModal: OrderModal,
    employeeModal: EmployeeModal,
    payoutsModal: PayoutsModal
};

export const ModalContainer = () => {
    const modals = useModalStore(state => state.modals);

    return (
        <>
            {modals.map((modal, index) => {
                const Component = modalMap[modal.type];
                if (!Component) return null;

                return (
                    <Component
                        key={modal.id}
                        {...modal.props}
                        modalProps={modal.props}
                        modalId={modal.id}
                        zIndex={1000 + index}
                    />
                );
            })}
        </>
    );
};
