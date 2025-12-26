import {Modal} from "@/app/components/ui/Modal/Modal";
import styles from "./payoutsModal.module.scss";
import {useModalStore} from "@/store/modalStore";
import {Button} from "@/app/components/ui";
import {IEmployee} from "@/types/employee";
import {Column, Table} from "@/app/components/ui/Table/Table";
import employeesService from "@/services/employeesService";
import {useMutation, useQuery} from "@tanstack/react-query";
import {IWork} from "@/types/order";
import {IVehicle} from "@/types/vehicles";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {FC} from "react";
import {Price} from "@/app/components/ui/Price/Price";

interface PayoutsModalProps {
    modalProps: IEmployee;
}

export const PayoutsModal: FC<PayoutsModalProps> = ({modalProps: employee}) => {
    const closeModal = useModalStore(state => state.closeModal)

    const {
        data: balance,
        isLoading
    } = useQuery({
        queryKey: ['balance'],
        queryFn: () => employeesService.getEmployeeBalance(employee.id),
    });

    const payoutMutation = useMutation({
        mutationFn: () => employeesService.payoutEmployee(employee.id),
        onSuccess: () => {
            toast.success('Заробітна плата успішно виплачена!');
            closeModal();
        },
        onError: () => {
            toast.error('Помилка під час виплати');
        }
    });

    const handlePayout = () => {
        payoutMutation.mutate();
    };

    const columns: Column<IWork>[] = [
        {
            key: 'date',
            label: 'Дата',
            width: '120px',
            render: date => dayjs(date).format('DD.MM.YYYY')
        },
        {
            key: 'vehicle',
            label: 'Замовлення',
            minWidth: '250px',
            render: (vehicle: IVehicle) => <div
                className={styles.vehicle}>{vehicle?.brand} {vehicle?.model} {vehicle?.plate &&
              <div>{vehicle.plate}</div>}
            </div>
        },
        {
            key: 'work',
            label: 'Опис роботи',
        },
        {
            key: 'price',
            label: 'Вартість',
            width: '130px',
            render: price => <Price value={price}/>
        },
        {
            key: 'commission',
            label: `ЗП (${employee.commissionRate}%)`,
            width: '130px',
            align: 'right',
            render: (commission: number) => <div className={styles.commission}><Price value={commission}/></div>
        },
    ]

    return (<Modal
        headerText={<div className={styles.modalHeader}>
            <h3>Розрахунок Зарплати</h3>
            <p>{employee.name} {employee?.role && ` - ${employee.role}`} (комісія: {employee.commissionRate} %)</p>
        </div>}
        className={styles.modal}
    >
        <div className={styles.modalBody}>
            <div className={styles.tableContainer}>
                <h4>Виконані роботи</h4>

                <Table<IWork>
                    columns={columns}
                    data={balance?.works || []}
                    rowKey={row => row.name ?? ''}
                    isLoading={isLoading}
                />
            </div>

            <div className={styles.totalContainer}>
                <p>
                    Загальна сума робіт: <Price value={balance?.totalAmount || 0}/>
                </p>

                <h2>
                    До виплати: <Price value={balance?.totalCommission || 0}/>
                </h2>
            </div>

            <div className={styles.actions}>
                <Button
                    onClick={() => closeModal()}
                >
                    Закрити
                </Button>

                <Button
                    variant={'primary'}
                    onClick={handlePayout}
                    isLoading={payoutMutation.isPending}
                >
                    Здійснити виплату
                </Button>
            </div>
        </div>
    </Modal>)
}