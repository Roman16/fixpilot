"use client"

import styles from "./employees.module.scss";
import {IEmployee} from "@/types/employee";
import {useEmployeesList} from "@/hooks/employees/useEmployeesList";
import {useModalStore} from "@/store/modalStore";
import {useState} from "react";
import {useEmployeesMutations} from "@/hooks/employees/useEmployeesMutations";
import {EmployeeItem} from "@/app/(protected)/employees/components/EmployeeItem";

export const Employees = () => {
    const openConfirm = useModalStore(state => state.openConfirm);
    const openModal = useModalStore(state => state.openModal);

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {deleteEmployee} = useEmployeesMutations();

    const {
        data,
        isLoading,
        isFetching
    } = useEmployeesList()


    const handleDelete = async (id: string | undefined) => {
        const confirmed = await openConfirm(<>Ви впевнені, що хочете видалити працівника?<br/>
            Він буде прибраний з усіх виконаних робіт у замовленнях.
            Після цього необхідно вручну призначити нового виконавця.</>);

        if (confirmed && id) {
            setDeletingId(id);
            try {
                await deleteEmployee.mutateAsync(id);
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (<div className={styles.employeesList}>
        {data?.data.map((employee: IEmployee) => <EmployeeItem
            key={employee.id}
            employee={employee}
            onEdit={() => openModal('employeeModal', employee)}
            onDelete={() => employee?.id && handleDelete(employee.id)}
            onPaid={() => openModal('payoutsModal', employee)}
            isDeleting={employee.id === deletingId}
        />)}
    </div>)
};