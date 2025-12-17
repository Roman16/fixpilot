import {IPayout} from "@/types/payout";
import {FC} from "react";
import dayjs from "dayjs";
import {Column, Table} from "@/app/components/ui/Table/Table";
import styles from "@/app/(protected)/clients/clients.module.scss";

interface PayoutsProps {
    payouts?: IPayout[]
}

export const Payouts: FC<PayoutsProps> = ({payouts}) => {
    const vehicleColumns: Column<IPayout>[] = [
        {
            key: 'createdAt',
            label: 'Дата',
            render: date => dayjs(date).format('DD.MM.YYYY')
        },
        {
            key: 'totalAmount',
            label: 'Вартість робіт',
            render: s => `${s} ₴`
        },
        {
            key: 'commission',
            label: 'Комісія',
            render: s => `${s} %`
        },
        {
            key: 'totalCommission',
            label: 'Сума виплати',
            render: s => `${s} ₴`
        },

    ];

    return (<div className={styles.vehiclesBlock}>
            <h3>Історія виплат</h3>

            <Table<IPayout>
                columns={vehicleColumns}
                data={payouts || []}
                rowKey={v => v.id}
                emptyText="Немає транспорту"
            />
        </div>
    );
}