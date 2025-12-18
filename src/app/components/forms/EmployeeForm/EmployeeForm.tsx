"use client"

import {Button, Input} from "@/app/components/ui";
import styles from "./employeeForm.module.scss";
import {useForm} from 'react-hook-form';
import React from "react";
import {IEmployee} from "@/types/employee";

interface EmployeeFormProps {
    onSubmit: (data: any) => void;
    onClose: () => void;
    employee: IEmployee;
    loading: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
                                                              onSubmit,
                                                              onClose,
                                                              employee,
                                                              loading
                                                          }) => {
    const {register, handleSubmit} = useForm<IEmployee>({
        defaultValues: {
            name: employee?.name || '',
            phone: employee?.phone || '',
            role: employee?.role || '',
            commission: employee?.commission || 40
        }
    });

    return (<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input
            placeholder={'Ведіть ім`я працівника'}
            label={'Ім`я'}
            {...register('name')}
        />

        <Input
            placeholder={'Ведіть номер телефон'}
            label={'Телефон'}
            {...register('phone')}
        />

        <Input
            placeholder={'Ведіть посаду працівника'}
            label={'Посада'}
            {...register('role')}
        />

        <Input
            placeholder={'Ведіть відсоток комісії (%)'}
            label={'Відсоток комісії (%)'}
            {...register('commission', {
                valueAsNumber: true
            })}
        />
        <p className={styles.commissionDescriptions}>
            Відсоток від вартості виконаних робіт, який отримує працівник.
        </p>

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