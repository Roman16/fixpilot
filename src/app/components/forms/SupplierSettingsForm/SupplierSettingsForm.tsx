'use client';

import styles from "./supplierSettingsForm.module.scss";
import {useForm} from 'react-hook-form';
import {Button, Input} from "@/app/components/ui";
import {useProfile, useUpdateProfile} from "@/hooks/profile/useProfile";
import {useEffect, useState} from "react";

interface SupplierFormValues {
    supplierLogin: string;
    supplierPassword: string;
}

export const SupplierSettingsForm = () => {
    const {data: profile} = useProfile();
    const updateProfileMutation = useUpdateProfile();
    const [showPassword, setShowPassword] = useState(false);

    const {
        handleSubmit,
        register,
        reset,
        formState: {isSubmitting},
    } = useForm<SupplierFormValues>({
        defaultValues: {
            supplierLogin: '',
            supplierPassword: '',
        },
    });

    useEffect(() => {
        if (profile) {
            reset({
                supplierLogin: profile.supplierLogin || '',
                supplierPassword: profile.supplierPassword || '',
            });
        }
    }, [profile, reset]);

    const onSubmit = async (values: SupplierFormValues) => {
        const formData = new FormData();
        formData.append("supplierLogin", values.supplierLogin);
        formData.append("supplierPassword", values.supplierPassword);
        updateProfileMutation.mutate(formData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.header}>
                <h3>order.vladislav.ua</h3>
                <p>Дані для підключення до каталогу постачальника</p>
            </div>

            <div className={styles.fields}>
                <Input
                    label="Логін"
                    autoComplete="off"
                    {...register("supplierLogin")}
                />

                <div className={styles.passwordWrap}>
                    <Input
                        label="Пароль"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register("supplierPassword")}
                    />
                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>
            </div>

            <Button
                variant="primary"
                className={styles.saveBtn}
                disabled={isSubmitting}
                isLoading={updateProfileMutation.isPending}
            >
                Зберегти
            </Button>
        </form>
    );
};