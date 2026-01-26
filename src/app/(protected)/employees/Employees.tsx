"use client"

import styles from "./employees.module.scss";
import {IEmployee} from "@/types/employee";
import {useEmployeesList} from "@/hooks/employees/useEmployeesList";
import {useModalStore} from "@/store/modalStore";
import {useState} from "react";
import {useEmployeesMutations} from "@/hooks/employees/useEmployeesMutations";
import {EmployeeItem} from "@/app/(protected)/employees/components/EmployeeItem";
import {EmployeeSkeleton} from "@/app/(protected)/employees/components/EmployeeSkeleton";
import {AddEmployee} from "@/app/(protected)/employees/components/AddEmployee";

const SKELETON_COUNT = 2;

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

    if (isLoading) {
        return (
            <div className={styles.employeesList}>
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <EmployeeSkeleton key={i} />
                ))}
            </div>
        );
    }

    if(data?.data.length === 0) return <div className={styles.employeesList}><AddEmployee/></div>

    return (<div className={styles.employeesList}>
        {data?.data.map((employee: IEmployee) => <EmployeeItem
            key={employee.id}
            employee={employee}
            onEdit={() => openModal('employeeModal', employee)}
            onDelete={() => employee?.id && handleDelete(employee.id)}
            onPaid={() => openModal('payoutsModal')}
            isDeleting={employee.id === deletingId}
        />)}
    </div>)
};