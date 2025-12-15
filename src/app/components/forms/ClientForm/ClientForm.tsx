"use client"

import {Button, Input} from "@/app/components/ui";
import styles from "./clientForm.module.scss";
import {VehicleForm} from "@/app/components/forms/VehicleForm/VehicleForm";
import {useFieldArray, useForm} from 'react-hook-form';
import {IClient} from "@/types/client";
import React from "react";
import {Textarea} from "@/app/components/ui/Textarea/Textarea";

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
    const {control, register, handleSubmit, setValue} = useForm({
        defaultValues: {
            name: client.name || '',
            phone: client.phone || '',
            comment: client.comment || '',
            vehicles: client.vehicles || [{}]
        }
    });

    const {fields} = useFieldArray({
        control,
        name: "vehicles"
    });

    return (<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
            <Input
                placeholder={'Ведіть ім`я клієнта'}
                label={'Ім`я'}
                {...register('name')}
            />

            <Input
                placeholder={'Ведіть номер телефон'}
                label={'Телефон'}
                {...register('phone')}
            />
        </div>

        <div className={styles.formBody}>
            {fields.map((field, index) => (
                <VehicleForm
                    key={field.id}
                    prefix={`vehicles.${index}`}
                    register={register}
                    setValue={setValue}
                    control={control}
                />
            ))}

            <Textarea
                placeholder={'Додайте будь-який коментар про клієнта'}
                label={'Коментар'}
                {...register('comment')}
            />
        </div>

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