import styles from '../employees.module.scss'
import clsx from "clsx";
import {UserPlus} from "lucide-react";
import {useModalStore} from "@/store/modalStore";

export const AddEmployee = () => {
    const openModal = useModalStore(state => state.openModal);

    return (<div className={clsx(styles.employeeItem, styles.addEmployee)} onClick={() => openModal('employeeModal')}>
        <UserPlus/>
        Додати працівника
    </div>)
}