"use client"

import {Column, Table} from "@/app/components/ui/Table/Table";
import {Button} from "@/app/components/ui";
import tableStyles from "@/app/components/ui/Table/table.module.scss";
import {TableActions} from "@/app/components/TableActions/TableActions";
import {useModalStore} from "@/store/modalStore";
import {IClient} from "@/types/client";
import dayjs from 'dayjs';
import {useClients} from "@/hooks/useClients";
import {useState} from "react";


export const Clients = () => {
    const openModal = useModalStore(state => state.openModal);
    const openConfirm = useModalStore(state => state.openConfirm);
    const {getClients, deleteClient} = useClients();

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const {
        data,
        isLoading,
        isError
    } = getClients;

    const handleDelete = async (id: string | undefined) => {
        const confirmed = await openConfirm('Ви впевнені, що хочете видалити клієнта?');

        if (confirmed && id) {
            setDeletingId(id);
            try {
                await deleteClient.mutateAsync(id);
            } finally {
                setDeletingId(null);
            }
        }
    };

    const handleEdit = (client?: IClient) => {
        openModal('clientModal', client)
    }

    const columns: Column<IClient>[] = [
        {
            key: 'name',
            label: 'Ім’я',
            width: '300px',
        },
        {
            key: 'phone',
            label: 'Телефон',
            width: '200px',
        },
        {
            key: 'updatedAt',
            label: 'Останній візит',
            width: '150px',
            render: (value: string) => dayjs(value).format('DD.MM.YYYY')
        },
        {
            key: 'comment',
            label: 'Коментар',
        },
        {
            key: 'actions',
            label: 'Дії',
            width: '100px',
            render: (_: any, row?: IClient) => <div className={tableStyles.actionsCol}>
                <Button
                    iconType={'edit'}
                    onClick={() => handleEdit(row)}
                    disabled={deletingId === row?.id}
                />
                <Button
                    iconType={'delete'}
                    isLoading={deletingId === row?.id}
                    onClick={() => row?.id && handleDelete(row.id)}
                />
            </div>
        },
    ]


    return (<>
        <TableActions
            onAdd={() => openModal('clientModal')}
        />

        <Table<IClient>
            columns={columns}
            data={data?.data ?? []}
            rowKey={row => row.id ?? ''}
            isLoading={isLoading}
        />

        {/*<Pagination*/}
        {/*    currentPage={1}*/}
        {/*    totalPages={30}*/}
        {/*    onPageChange={(page) => {*/}
        {/*        console.log(page);*/}
        {/*    }}*/}
        {/*/>*/}
    </>)
}