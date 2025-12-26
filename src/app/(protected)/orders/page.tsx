import {Heading} from "@/app/components/layout/Heading/Heading";
import {Orders} from "@/app/(protected)/orders/Orders";
import styles from "./orders.module.scss";
import clsx from "clsx";

export default function OrdersPage() {
    return (<div className={clsx('orders-page', styles.ordersPage)}>
        <Heading
            title={'Замовлення'}
            actionType={'orderModal'}
            actionBtnText={'Додати замовлення'}
        />

        <Orders/>
    </div>)
}