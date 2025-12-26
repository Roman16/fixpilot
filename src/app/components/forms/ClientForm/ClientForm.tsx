"use client"

import {Button, Input} from "@/app/components/ui";
import styles from "./clientForm.module.scss";
import {VehicleForm} from "@/app/components/forms/VehicleForm/VehicleForm";
import {useFieldArray, useForm} from 'react-hook-form';
import {IClient} from "@/types/client";
import React from "react";
import {Textarea} from "@/app/components/ui/Textarea/Textarea";
import {MessageSquareMore, Motorbike, User} from "lucide-react";

interface ClientFormProps {
    onSubmit: (data: any) => void;
    onClose: () => void;
    client?: IClient;
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
            name: client?.name || '',
            phone: client?.phone || '',
            comment: client?.comment || '',
            vehicles: client?.vehicles || [{}]
        }
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "vehicles"
    });

    return (<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
            <div className={styles.col}>
                <div className={styles.clientInfo}>
                    <h3>
                        <i className={styles.titleIcon}><User/></i>
                        Дані клієнта
                    </h3>
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

                <div className={styles.commentBlock}>
                    <h3>
                        <i className={styles.titleIcon}><MessageSquareMore/></i>
                        Коментар
                    </h3>

                    <Textarea
                        rows={4}
                        placeholder={'Додайте будь-який коментар про клієнта'}
                        {...register('comment')}
                    />
                </div>
            </div>

            <div className={styles.vehiclesBlock}>
                <h3 className={styles.groupTitle}>
                    <i className={styles.titleIcon}><Motorbike /></i>
                    Гараж

                    {!client?.id && <Button
                        iconType={'plus'}
                        className={styles.addBtn}
                        type="button"
                        onClick={() => append({})}
                    >
                        Додати
                    </Button>}
                </h3>

                {fields.map((field, index) => (
                    <VehicleForm
                        key={field.id}
                        prefix={`vehicles.${index}`}
                        register={register}
                        setValue={setValue}
                        control={control}
                        disabled={!!client?.id}
                        {...(fields.length > 1 ? { onRemove: () => remove(index) } : {})}
                    />
                ))}
            </div>
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