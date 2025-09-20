import {Heading} from "@/app/components/layout/Heading/Heading";
import {Clients} from "@/app/(protected)/clients/Clients";

export default function ClientsPage() {
    return (<div className={'clients-page'}>
        <Heading title={'Клієнти'}/>

        <Clients/>
    </div>)
}