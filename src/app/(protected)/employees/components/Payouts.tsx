import {IPayout} from "@/types/payout";
import {FC} from "react";
import dayjs from "dayjs";
import styles from "../employees.module.scss"
import {Price} from "@/app/components/ui/Price/Price";

interface PayoutsProps {
    payouts?: IPayout[]
}

export const Payouts: FC<PayoutsProps> = ({payouts = []}) => {
    return (<div className={styles.payoutsList}>
            {payouts.length === 0 && <p>Історія порожня</p>}

            {payouts.map(i => <div>
                {dayjs(i.createdAt).format('DD.MM.YYYY HH:mm')}

                <Price value={i.totalCommission}/>
            </div>)}
        </div>
    );
}