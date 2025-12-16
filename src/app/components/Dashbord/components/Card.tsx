import styles from '../dashboard.module.scss'
import {FC} from "react";

interface CardProps {
    title: string,
    value: string,
}

export const Card: FC<CardProps> = ({
                                        title,
                                        value
                                    }) => {

    return (<div className={styles.card}>
        <h4>{title}</h4>
        <h2>{value}</h2>
    </div>)
}