import {Heading} from "@/app/components/layout/Heading/Heading";
import {Orders} from "@/app/(protected)/orders/Orders";

export default function OrdersPage() {
    return (<div className={'orders-page'}>
        <Heading
            title={'Замовлення'}
            actionType={'orderModal'}
            actionBtnText={'Додати замовлення'}
        />

        <Orders/>
    </div>)
}