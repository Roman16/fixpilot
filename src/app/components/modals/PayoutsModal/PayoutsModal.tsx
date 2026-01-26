import {Modal} from "@/app/components/ui/Modal/Modal";
import styles from "./payoutsModal.module.scss";
import {useModalStore} from "@/store/modalStore";
import {Button} from "@/app/components/ui";
import {Column, Table} from "@/app/components/ui/Table/Table";
import employeesService from "@/services/employeesService";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {IWork} from "@/types/order";
import {IVehicle} from "@/types/vehicles";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {Price} from "@/app/components/ui/Price/Price";
import {IPayout} from "@/types/payout";

export const PayoutsModal = () => {
    const closeModal = useModalStore(state => state.closeModal)
    const queryClient = useQueryClient();

    const {
        data: balance,
        isLoading
    } = useQuery({
        queryKey: ['balance'],
        queryFn: () => employeesService.getEmployeesBalance(),
    });

    const payoutMutation = useMutation({
        mutationFn: () => employeesService.payoutEmployees(),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['employees']})
                .then(() => {
                    toast.success('Заробітна плата успішно виплачена!');
                    closeModal();
                })
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
            minWidth: '120px',
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
            minWidth: '200px',
        },
        {
            key: 'price',
            label: 'Вартість',
            width: '110px',
            render: price => <Price value={price}/>
        },
        {
            key: 'commission',
            label: `Комісія`,
            width: '130px',
            minWidth: '130px',
            align: 'right',
            render: (commission: number) => <div className={styles.commission}><Price value={commission}/></div>
        },
    ]

    const employeeColumns: Column<any>[] = [
        {
            key: 'name',
            label: 'Ім`я',
            render: (_, data) => data.employee.name
        },
        {
            key: 'commission',
            label: 'Комісія',
            render: (_, data) => `${data.employee.commissionRate}%`
        },
        {
            key: 'totalAmount',
            label: 'Загальна вартість робіт',
            render: (data) => <Price value={data}/>
        },
        {
            key: 'totalCommission',
            label: 'Загальна комісія',
            align: 'right',
            render: (data) => <span style={{fontWeight: 600}}><Price value={data}/></span>
        },
    ]

    return (<Modal headerText={<div className={styles.modalHeader}>
        <h3>Розрахунок Зарплати</h3>
    </div>}
                   className={styles.modal}
    >
        <div className={styles.modalBody}>
            <div className={styles.tableContainer}>
                <Table<IPayout>
                    columns={employeeColumns}
                    data={balance || []}
                    rowKey={row => row.id ?? ''}
                    isLoading={isLoading}

                    expandable={{
                        expandOnRowClick: true,
                        singleExpand: true,
                        isRowExpandable: () => true,
                        renderExpanded: row => (<div className={styles.expandedContainer}>
                                <Table<IWork>
                                    columns={columns}
                                    data={row?.works || []}
                                    rowKey={row => row.name ?? ''}
                                    isLoading={isLoading}
                                />
                            </div>
                        )
                    }}
                />
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