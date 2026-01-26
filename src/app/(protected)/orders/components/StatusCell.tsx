import clsx from "clsx";
import styles from "../orders.module.scss";

type OrderStatus = 'completed' | 'new' | 'archived';

export const StatusCell: React.FC<{ status: OrderStatus, isLoading: boolean, onClick: () => void }> = ({
                                                                                                      status,
                                                                                                      isLoading,
                                                                                                      onClick
                                                                                                  }) => {
    const statusMap = {
        'completed': 'Виконане',
        'new': 'В роботі',
        'archived': 'Архів'
    }

    return <div className={clsx(styles[status], styles.statusTd, {
        [styles.isLoading]: isLoading
    })} onClick={(e) => {
        e.stopPropagation()
        status === 'new' && onClick()
    }}>
        {statusMap[status] ?? status}
    </div>
}