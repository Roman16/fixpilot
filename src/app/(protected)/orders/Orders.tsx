"use client"

import styles from "./orders.module.scss";
import {Column, Table} from "@/app/components/ui/Table/Table";
import {IMaterial, IOrder, IWork} from "@/types/order";
import {useModalStore} from "@/store/modalStore";
import {useOrdersList} from "@/hooks/orders/useOrdersList";
import React, {useState} from "react";
import tableStyles from "@/app/components/ui/Table/table.module.scss";
import {Button} from "@/app/components/ui";
import {useOrdersMutations} from "@/hooks/orders/useOrdersMutations";
import dayjs from "dayjs";
import {formatPlate} from "@/utils/helpers";
import {StatusCell} from "@/app/(protected)/orders/components/StatusCell";
import {OrderDetails} from "@/app/(protected)/orders/components/OrderDetails";
import {Price} from "@/app/components/ui/Price/Price";
import {useProfile} from "@/hooks/profile/useProfile";
import {pdf} from "@react-pdf/renderer";
import {PdfTemplate} from "@/utils/pdf/PdfTemplate";


export const Orders = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState("");

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const openModal = useModalStore(state => state.openModal);
    const openConfirm = useModalStore(state => state.openConfirm);

    const {deleteOrder, updateOrder} = useOrdersMutations();
    const {data, isLoading, isFetching} = useOrdersList(page, limit, search);
    const {data: profile} = useProfile();


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
        setUpdatingId(order.id);

        try {
            await updateOrder.mutateAsync({
                ...order,
                status: 'completed',
                closedAt: dayjs().toString(),
            });
        } finally {
            setUpdatingId(null);
        }
    }

    const handleSearch = (value: string) => {
        setSearch(value)
        setPage(1)
    }

    const handlePrint = async (order: IOrder) => {
        const blob = await pdf(
            <PdfTemplate
                order={{
                    ...order,
                    createdAt: order?.createdAt || dayjs().toString(),
                    orderNumber: order?.orderNumber || 666
                }}
                profile={profile}
            />
        ).toBlob();

        const fileName = `Наряд-замовлення_${order.vehicle?.brand || ""}_${order.vehicle?.plate || ""}.pdf`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
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
            render: (status, order) => <StatusCell
                isLoading={updatingId === order.id}
                status={status}
                onClick={() => handleChangeStatus(order)}
            />
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
            render: (_, order) => <b><Price value={calcTotalSum(order?.works || [], order?.materials || [])}/></b>
        },
        {
            key: 'actions',
            width: '140px',
            minWidth: '140px',
            render: (_, order) => <div className={tableStyles.actionsCol}>
                <Button
                    iconType={'print'}
                    onClick={(e) => {
                        e.stopPropagation()
                        handlePrint(order)
                    }}
                />
                <Button
                    iconType={'edit'}
                    onClick={(e) => {
                        e.stopPropagation()
                        openModal('orderModal', order)
                    }}
                    disabled={deletingId === order?.id}
                />
                <Button
                    iconType={'delete'}
                    isLoading={deletingId === order.id}
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(order.id)
                    }}
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

            expandable={{
                singleExpand: true,
                expandOnRowClick: true,
                isRowExpandable: row => !!row?.works?.length,
                renderExpanded: row => (
                    <OrderDetails
                        order={row}
                    />
                )
            }}
        />
    </>)
}

