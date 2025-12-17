"use client"

import {Column, Table} from "@/app/components/ui/Table/Table";
import {Button} from "@/app/components/ui";
import tableStyles from "@/app/components/ui/Table/table.module.scss";
import {useModalStore} from "@/store/modalStore";
import {IClient} from "@/types/client";
import dayjs from 'dayjs';
import {useState} from "react";
import {useClientsList} from "@/hooks/clients/useClientsList";
import {useClientsMutations} from "@/hooks/clients/useClientsMutations";
import {VehiclesTable} from "@/app/(protected)/clients/components/VehiclesTable";
import styles from "./clients.module.scss";

export const Clients = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState("");

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const openModal = useModalStore(state => state.openModal);
    const openConfirm = useModalStore(state => state.openConfirm);

    const {deleteClient, deleteVehicle} = useClientsMutations();
    const {data, isLoading, isFetching} = useClientsList(page, limit, search);

    const pagination = data?.pagination;
    const clients = data?.data ?? [];

    const handleDelete = async (id: string | undefined) => {
        const confirmed = await openConfirm(<>Ви впевнені, що хочете видалити клієнта? <br/> Всі замовлення на даного клієнта будуть видалені!</>);

        if (confirmed && id) {
            setDeletingId(id);
            try {
                await deleteClient.mutateAsync(id);
            } finally {
                setDeletingId(null);
            }
        }
    };

    const handleDeleteVehicle = async (data: { clientId: string, vehicleId: string }) => {
        const confirmed = await openConfirm(<>Ви впевнені, що хочете видалити транспортний засіб? <br/> Всі замовлення на даний транспортний засіб будуть видалені!</>);

        if (confirmed) await deleteVehicle.mutateAsync(data)
    }

    const handleEdit = (client?: IClient) => {
        openModal('clientModal', client)
    }

    const handleSearch = (value: string) => {
        setSearch(value)
        setPage(1)
    }

    const columns: Column<IClient>[] = [
        {
            key: 'name',
            label: 'Ім’я',
            minWidth: '200px',
        },
        {
            key: 'phone',
            label: 'Телефон',
            minWidth: '200px',
        },
        {
            key: 'vehicles',
            label: 'Автопарк',
            width: '200px',
            render: (arr) => <div className={styles.vehicles}>{arr.length} ТЗ</div>
        },
        {
            key: 'updatedAt',
            label: 'Останній візит',
            width: '200px',
            minWidth: '150px',
            render: (value: string) => dayjs(value).format('DD.MM.YYYY')
        },
        {
            key: 'comment',
            label: 'Коментар',
            width: '400px',
            minWidth: '200px',
        },
        {
            key: 'actions',
            label: 'Дії',
            width: '100px',
            render: (_: any, row?: IClient) => <div className={tableStyles.actionsCol}>
                <Button
                    iconType={'edit'}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(row)
                    }}
                    disabled={deletingId === row?.id}
                />
                <Button
                    iconType={'delete'}
                    isLoading={deletingId === row?.id}
                    onClick={(e) => {
                        e.stopPropagation()
                        row?.id && handleDelete(row.id)
                    }}
                />
            </div>
        },
    ]

    return (<>
        <Table<IClient>
            columns={columns}
            data={clients}
            rowKey={row => row.id ?? ''}
            isLoading={isLoading || isFetching}
            searchable
            searchPlaceholder={'Пошук клієнтів (ім`я, номер телефону)'}
            onSearch={handleSearch}

            pagination={{
                currentPage: pagination?.page ?? 1,
                totalPages: pagination?.pages ?? 1,
                onPageChange: setPage,
            }}

            expandable={{
                expandOnRowClick: true,
                isRowExpandable: row => !!row?.vehicles?.length,
                renderExpanded: row => (
                    <VehiclesTable
                        vehicles={row?.vehicles || []}
                        onDelete={(id) => handleDeleteVehicle({
                            clientId: row.id,
                            vehicleId: id
                        })}
                    />
                )
            }}
        />
    </>)
}