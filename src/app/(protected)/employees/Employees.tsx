"use client"

import {Column, Table} from "@/app/components/ui/Table/Table";
import tableStyles from "@/app/components/ui/Table/table.module.scss";
import {Button} from "@/app/components/ui";
import {IEmployee} from "@/types/employee";
import {useEmployeesList} from "@/hooks/employees/useEmployeesList";
import {useModalStore} from "@/store/modalStore";
import {useState} from "react";
import {useEmployeesMutations} from "@/hooks/employees/useEmployeesMutations";
import {VehiclesTable} from "@/app/(protected)/clients/components/VehiclesTable";
import {Payouts} from "@/app/(protected)/employees/components/Payouts";

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

    const columns: Column<IEmployee>[] = [
        {
            key: 'name',
            label: 'Ім’я',
            minWidth: '150px',
        },
        {
            key: 'phone',
            label: 'Телефон',
            minWidth: '150px',
        },
        {
            key: 'role',
            label: 'Посада',
            minWidth: '150px',
        },
        {
            key: 'commission',
            label: 'Комісія',
            width: '200px',
            minWidth: '100px',
            align: 'center',
            render: commission => `${commission} %`
        },
        {
            key: 'actions',
            label: 'Дії',
            width: '200px',
            minWidth: '150px',
            align: 'center',
            render: (_: any, row?: IEmployee) => <div className={tableStyles.actionsCol}>
                <Button
                    iconType={'pay'}
                    onClick={() => openModal('payoutsModal', row)}
                    disabled={deletingId === row?.id}
                    title={'Розрахувати виплату'}
                />

                <Button
                    iconType={'edit'}
                    onClick={() => openModal('employeeModal', row)}
                    disabled={deletingId === row?.id}
                    title={'Редагувати працівника'}
                />

                <Button
                    iconType={'delete'}
                    isLoading={deletingId === row?.id}
                    onClick={() => row?.id && handleDelete(row.id)}
                    title={'Видалити працівника'}
                />
            </div>
        },
    ]

    return (<>
        <Table<IEmployee>
            columns={columns}
            data={data?.data ?? []}
            rowKey={row => row.id ?? ''}
            isLoading={isLoading || isFetching}

            expandable={{
                expandOnRowClick: true,
                isRowExpandable: row => true,
                renderExpanded: row => <Payouts payouts={row.payouts}/>
            }}
        />
    </>)
};