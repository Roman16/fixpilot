import {Input} from "@/app/components/ui";
import styles from "./vehicleForm.module.scss";

export const VehicleForm = () => {
    return (<div className={styles.vehicleWrap}>
        <h3 className={styles.groupTitle}>
            Транспортний засіб
            {/*<Button iconType={'plus'}>Додати</Button>*/}
        </h3>

        <div className={styles.row}>
            <Input
                placeholder={'BMW'}
                label={'Марка'}
            />

            <Input
                placeholder={'S1000RR'}
                label={'Модель'}
            />
        </div>

        <div className={styles.row}>
            <Input
                placeholder={'АА 1111 АА'}
                label={'Номерний знак'}
            />

            <Input
                placeholder={'69000'}
                label={'Пробіг'}
            />
        </div>

        <Input
            placeholder={'JWJF353664JBB36RT'}
            label={'VIN'}
        />
    </div>)
}