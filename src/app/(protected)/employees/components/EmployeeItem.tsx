import {IEmployee} from "@/types/employee";
import {FC} from "react";
import styles from '../employees.module.scss'
import {Button} from "@/app/components/ui";
import {ChevronDown} from "lucide-react";

interface IEmployeeItemProps {
    employee: IEmployee,
    onEdit: () => void,
    onDelete: () => void,
    onPaid: () => void,
}

export const EmployeeItem: FC<IEmployeeItemProps> = ({employee, onEdit, onDelete, onPaid}) => {
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

            <span>{employee.commission}%</span>
        </div>


        <div className={styles.actions}>
            <Button
                onClick={onEdit}
                iconType={'edit'}
            />

            <Button
                onClick={onDelete}
                iconType={'delete'}
            />
        </div>

        <div className={styles.row}>
            <div className={styles.total}>
                <p>Зароблено</p>
                <h3>10 ₴</h3>
            </div>

            <div className={styles.total}>
                <p>Виплачено</p>
                <h3>10 ₴</h3>
            </div>
        </div>

        <div className={styles.balance}>
            <div>
                <p>До виплати</p>
                <h3>1000 ₴</h3>
            </div>

            <Button
                onClick={onPaid}
            >
                Виплатити
            </Button>
        </div>

        <div className={styles.history}>
            <div className={styles.historyBtn}>
                Історія виплат
                <i><ChevronDown/></i>
            </div>
        </div>
    </div>)
}