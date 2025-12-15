import {Heading} from "@/app/components/layout/Heading/Heading";
import {Clients} from "@/app/(protected)/clients/Clients";

export default function ClientsPage() {
    return (<div className={'clients-page'}>
        <Heading
            title={'Клієнти'}
            actionType={'clientModal'}
            actionBtnText={'Додати клієнта'}
        />

        <Clients/>
    </div>)
}