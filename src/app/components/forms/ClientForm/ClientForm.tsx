"use client"

import {Button, Input} from "@/app/components/ui";
import styles from "./clientForm.module.scss";
import {VehicleForm} from "@/app/components/forms/VehicleForm/VehicleForm";
import {useForm} from 'react-hook-form';
import {IClient} from "@/types/client";

interface ClientFormProps {
    onSubmit: (data: any) => void;
    onClose: () => void;
    client: IClient;
    loading: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
                                                          onSubmit,
                                                          onClose,
                                                          client,
                                                          loading
                                                      }) => {
    const {register, handleSubmit} = useForm({
        defaultValues: {
            client: {
                name: client.name || '',
                phone: client.phone || '',
                comment: client.comment || ''
            }
        }
    });


    return (<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
            <Input
                placeholder={'Ведіть ім`я клієнта'}
                label={'Ім`я'}
                {...register('client.name')}
            />

            <Input
                placeholder={'Ведіть номер телефон'}
                label={'Телефон'}
                {...register('client.phone')}
            />
        </div>

        <Input
            type={'multitext'}
            placeholder={'Додайте будь-який коментар про клієнта'}
            label={'Коментар'}
            {...register('client.comment')}
        />

        {/*<VehicleForm/>*/}

        <div className={styles.actions}>
            <Button
                type={'button'}
                onClick={onClose}
                disabled={loading}
            >
                Скасувати
            </Button>

            <Button
                type="submit"
                variant={'primary'}
                isLoading={loading}
            >
                Зберегти
            </Button>
        </div>
    </form>)
}