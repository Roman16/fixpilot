import clsx from "clsx";
import styles from "../orders.module.scss";
import {Loader} from "@/app/components/ui/Loader/Loader";

export const StatusCell: React.FC<{ status: string, isLoading: boolean, onClick: () => void }> = ({
                                                                                                      status,
                                                                                                      isLoading,
                                                                                                      onClick
                                                                                                  }) => {
    const text = status === 'completed' ? 'Виконане' : 'В роботі'

    return <div className={clsx(styles[status], styles.statusTd)} onClick={(e) => {
        e.stopPropagation()
        status === 'new' && onClick()
    }}>
        {isLoading && <Loader/>}
        {text}
    </div>
}