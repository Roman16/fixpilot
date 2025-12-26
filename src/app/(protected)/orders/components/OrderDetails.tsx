import {IOrder} from "@/types/order";
import styles from "../orders.module.scss";
import {Package, Wrench} from "lucide-react";


export const OrderDetails = ({order}: { order: IOrder }) => {
    console.log(order);
    return (<div className={styles.orderDetails}>
        <div className={styles.listGroup}>
            <h4><Wrench/>Виконані роботи</h4>

            <div className={styles.list}>
                {order.works.map(work => <div className={styles.listRow}>
                    <div>{work.name}</div>
                    <div>{work.price} ₴</div>
                </div>)}

                <div className={styles.totalRow}>
                    <div>Всього роботи:</div>
                    <div>{order.works.reduce((acc, work) => acc + (work?.price || 0), 0)} ₴</div>
                </div>
            </div>
        </div>

        <div className={styles.listGroup}>
            <h4><Package/> Матеріали</h4>

            <div className={styles.list}>
                {order.materials.map(work => <div className={styles.listRow}>
                    <div>{work.name}</div>
                    <div>{work.count}</div>
                    <div>{work.price} ₴</div>
                </div>)}

                <div className={styles.totalRow}>
                    <div>Всього матеріали:</div>
                    <div>{order.materials.reduce((acc, work) => acc + ((work?.price || 0) * (work?.count || 1)), 0)} ₴</div>
                </div>
            </div>
        </div>

    </div>)
}