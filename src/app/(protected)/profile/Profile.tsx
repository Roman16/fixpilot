'use client';

import styles from "./profile.module.scss";
import {useForm, Controller} from 'react-hook-form';
import {Button, Input} from "@/app/components/ui";
import {FileUploader} from "@/app/components/ui/FileUploader/FileUploader";
import {useProfile, useUpdateProfile} from "@/hooks/profile/useProfile";
import {useEffect} from "react";

interface ProfileFormValues {
    companyName?: string;
    email?: string;
    phone?: string;
    logo?: File | null;
}

export const Profile = () => {
    const {data: profile} = useProfile();
    const updateProfileMutation = useUpdateProfile();

    const {
        control,
        handleSubmit,
        register,
        reset,
        formState: {isSubmitting},
    } = useForm<ProfileFormValues>({
        defaultValues: {
            companyName: '',
            email: '',
            phone: '',
            logo: null,
        },
    });

    useEffect(() => {
        if (profile) {
            reset({
                companyName: profile.companyName || '',
                email: profile.email || '',
                phone: profile.phone || '',
                logo: null,
            });
        }
    }, [profile, reset]);

    const onSubmit = async (values: ProfileFormValues) => {
        const formData = new FormData();
        formData.append("companyName", values.companyName || '');
        formData.append("email", values.email || '');
        formData.append("phone", values.phone || '');
        if (values.logo) formData.append("logo", values.logo);

        updateProfileMutation.mutate(formData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.row}>
                <Controller
                    name="logo"
                    control={control}
                    render={({field}) => (
                        <FileUploader
                            value={field.value}
                            onChange={field.onChange}
                            accept={["image/*"]}
                            label="Логотип"
                        />
                    )}
                />

                <div className={styles.col}>
                    <Input
                        label="Назва компанії"
                        {...register("companyName", {
                            required: "Назва компанії обов'язкова",
                        })}
                    />

                    <div className={styles.fieldsRow}>
                        <Input
                            label="Email"
                            {...register("email", {
                                required: "Email обов'язковий",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Некоректний email",
                                },
                            })}
                        />

                        <Input
                            label="Номер телефону"
                            {...register("phone", {
                                required: "Телефон обов'язковий",
                            })}
                        />
                    </div>
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
