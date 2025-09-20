import {Button, Input} from "@/app/components/ui";
import styles from "./profile.module.scss";

export const Profile = () => {

    return (<form
        className={styles.form}
    >
        <div className={styles.row}>
            <Input
                label={'Email'}
            />

            <Input
                label={'Назва компанії'}
            />
        </div>


        <Button
            variant={'primary'}
        >
            Зберегти
        </Button>
    </form>)
}