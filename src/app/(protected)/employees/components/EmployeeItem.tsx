import {IEmployee} from "@/types/employee";
import {FC, useState} from "react";
import styles from '../employees.module.scss'
import {Button} from "@/app/components/ui";
import {ChevronDown} from "lucide-react";
import {Loader} from "@/app/components/ui/Loader/Loader";
import {Payouts} from "./Payouts";
import clsx from "clsx";

interface IEmployeeItemProps {
    employee: IEmployee,
    onEdit: () => void,
    onDelete: () => void,
    onPaid: () => void,
    isDeleting: boolean | null,
}

export const EmployeeItem: FC<IEmployeeItemProps> = ({employee, onEdit, onDelete, onPaid, isDeleting}) => {
    const [isPayoutsOpen, setIsPayoutsOpen] = useState(false);

    const handlePayoutsOpen = () => setIsPayoutsOpen(!isPayoutsOpen);

    return (<div className={styles.employeeItem}>
        <div className={styles.row}>
            <div className={styles.icon}>
                {employee.name?.[0] ?? 'E'}
            </div>
        </div>

        <div className={styles.employeeInfo}>
            <h3>
                {employee.role} {employee.name}
            </h3>
            <p>
                {employee.phone}
            </p>
        </div>


        <div className={styles.commission}>
            Комісія

            <span>{employee.commissionRate}%</span>
        </div>

        <div className={clsx(styles.history, {
            [styles.historyOpened]: isPayoutsOpen
        })}>
            <div className={styles.historyBtn} onClick={handlePayoutsOpen}>
                Історія виплат
                <i><ChevronDown/></i>
            </div>

            <Payouts payouts={employee.payouts}/>
        </div>

        <div className={styles.actions}>
            <Button
                title={'Розрахувати'}
                onClick={onPaid}
                iconType={'pay'}
            />
            <Button
                title={'Редагувати'}
                onClick={onEdit}
                iconType={'edit'}
            />

            <Button
                title={'Видалити'}
                onClick={onDelete}
                iconType={'delete'}
            />
        </div>

        {isDeleting && <Loader className={styles.loader}/>}
    </div>)
}