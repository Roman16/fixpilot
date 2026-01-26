import styles from '../employees.module.scss'
import clsx from "clsx";

export const EmployeeSkeleton = () => {
    return (<div className={clsx(styles.employeeItem, styles.skeleton)}>
        <div className={styles.row}>
            <div className={styles.icon}/>
        </div>

        <div className={styles.employeeInfo}>
            <h3 />
            <p />
        </div>


        <div className={styles.commission} />
    </div>)
}