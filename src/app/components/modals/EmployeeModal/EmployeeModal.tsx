import {Modal} from "@/app/components/ui/Modal/Modal";
import {useModalStore} from "@/store/modalStore";
import styles from "./employeeModal.module.scss";
import {IEmployee} from "@/types/employee";
import {EmployeeForm} from "@/app/components/forms/EmployeeForm/EmployeeForm";
import {useEmployeesMutations} from "@/hooks/employees/useEmployeesMutations";
import {FC} from "react";

interface EmployeeModalProps {
    modalId: string;
    modalProps: IEmployee;
}

export const EmployeeModal: FC<EmployeeModalProps> = ({modalId, modalProps: employee}) => {
    const {closeModal} = useModalStore()
    const {createEmployee, updateEmployee} = useEmployeesMutations();

    const submitHandler = async (data: IEmployee) => {
        try {
            if (employee?.id) {
                await updateEmployee.mutateAsync({...data, id: employee.id});
            } else {
                await createEmployee.mutateAsync(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            closeModal(modalId)
        }
    };

    return (<Modal headerText={employee?.id ? employee.name : 'Новий працівник'} className={styles.modal}>
        <EmployeeForm
            employee={employee}
            onSubmit={submitHandler}
            onClose={() => closeModal()}
            loading={false}
        />
    </Modal>)
}