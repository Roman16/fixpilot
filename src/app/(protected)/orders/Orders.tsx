"use client"

import styles from "./orders.module.scss";
import {Column, Table} from "@/app/components/ui/Table/Table";
import {IMaterial, IOrder, IWork} from "@/types/order";
import {useModalStore} from "@/store/modalStore";
import {useOrdersList} from "@/hooks/orders/useOrdersList";
import {useState} from "react";
import tableStyles from "@/app/components/ui/Table/table.module.scss";
import {Button} from "@/app/components/ui";
import {useOrdersMutations} from "@/hooks/orders/useOrdersMutations";
import dayjs from "dayjs";
import {formatPlate} from "@/utils/helpers";
import clsx from "clsx";


export const Orders = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState("");

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const openModal = useModalStore(state => state.openModal);
    const openConfirm = useModalStore(state => state.openConfirm);

    const {deleteOrder, updateOrder} = useOrdersMutations();
    const {data, isLoading, isFetching} = useOrdersList(page, limit, search);

    const orders = data?.data || []
    const pagination = data?.pagination;

    const calcTotalSum = (works: IWork[], materials: IMaterial[]) => works.reduce((acc, work) => acc + (work.price || 0), 0) + materials.reduce((acc, material) => acc + (material.price || 0), 0);

    const handleDelete = async (id: string) => {
        const confirmed = await openConfirm('Ви впевнені, що хочете видалити замовлення?');

        if (confirmed) {
            setDeletingId(id);
            try {
                await deleteOrder.mutateAsync(id);
            } finally {
                setDeletingId(null);
            }
        }
    };

    const handleChangeStatus = async (order: IOrder) => {
        updateOrder.mutate({
            ...order,
            status: 'completed',
            closedAt: dayjs().toString()
        });
    }

    const handleSearch = (value: string) => {
        setSearch(value)
        setPage(1)
    }

    const columns: Column<IOrder>[] = [
        {
            key: 'orderNumber',
            label: '№',
            width: '100px',
            minWidth: '100px',
            align: 'center',
            render: i => String(i).padStart(3, '0')
        },
        {
            key: 'client',
            label: 'Клієнт',
            minWidth: '200px',
            render: client => <div className={styles.clientTd}>
                <h4>{client?.name}</h4>
                <p>{client?.phone}</p>
            </div>
        },
        {
            key: 'vehicle',
            label: 'Транспортний засіб',
            minWidth: '200px',
            render: vehicle => <>{vehicle?.brand} - {vehicle?.model}</>
        },
        {
            key: 'plate',
            label: 'Номерний знак',
            width: '200px',
            minWidth: '150px',
            align: 'center',
            render: (_, order) => <div className={styles.plate}>{formatPlate(order?.vehicle?.plate)}</div>
        },
        {
            key: 'mileage',
            label: 'Пробіг',
            width: '200px',
            minWidth: '130px',
            align: 'center',
            render: mileage => `${mileage} км`
        },
        {
            key: 'status',
            label: 'Статус',
            width: '160px',
            minWidth: '160px',
            align: 'center',
            render: (status, order) => <StatusCell status={status} onClick={() => handleChangeStatus(order)}/>
        },
        {
            key: 'createdAt',
            label: 'Дата створення',
            width: '150px',
            minWidth: '150px',
            align: 'center',
            render: (value) => dayjs(value).format('DD.MM.YYYY')
        },
        {
            key: 'updatedAt',
            label: 'Дата закриття',
            width: '150px',
            minWidth: '150px',
            align: 'center',
            render: (value, order) => order.status === 'completed' ? dayjs(value).format('DD.MM.YYYY') : '—'
        },
        {
            key: 'sum',
            label: 'Сума',
            width: '150px',
            minWidth: '150px',
            align: 'center',
            render: (_, order) => <><b>{calcTotalSum(order?.works || [], order?.materials || [])}</b> ₴</>
        },
        {
            key: 'actions',
            width: '100px',
            render: (_, order) => <div className={tableStyles.actionsCol}>
                <Button
                    iconType={'edit'}
                    onClick={() => openModal('orderModal', order)}
                    disabled={deletingId === order?.id}
                />
                <Button
                    iconType={'delete'}
                    isLoading={deletingId === order.id}
                    onClick={() => handleDelete(order.id)}
                />
            </div>
        },
    ]

    return (<>
        <Table<IOrder>
            columns={columns}
            data={orders}
            rowKey={row => row.id ?? ''}
            isLoading={isLoading || isFetching}
            searchable
            onSearch={handleSearch}
            searchPlaceholder={'Пошук замовлень (клієнт, транспортний засіб)'}

            pagination={{
                currentPage: pagination?.page ?? 1,
                totalPages: pagination?.pages ?? 1,
                onPageChange: setPage,
            }}
        />
    </>)
}


const StatusCell: React.FC<{ status: string, onClick: () => void }> = ({status, onClick}) => {
    switch (status) {
        case 'new':
            return <div onClick={onClick} className={clsx(styles[status], styles.statusTd)}>В роботі</div>
        case 'completed':
            return <div className={clsx(styles[status], styles.statusTd)}>Виконане</div>
    }
}