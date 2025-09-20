import {FC} from 'react'
import styles from "./tableActions.module.scss";
import {Button, Input} from "@/app/components/ui";

interface TableActionsProps {
    onAdd: () => void;
}

export const TableActions: FC<TableActionsProps> = ({onAdd}) => {
    return (<div className={styles.searchBar}>
        <Input
            className={styles.field}
            placeholder={'Пошук клієнтів (Ім`я, номер телефону)'}
        />

        <Button
            variant={'primary'}
            className={styles.btn}
            iconType={'plus'}
            onClick={onAdd}
        >
            Додати клієнта
        </Button>
    </div>)
}