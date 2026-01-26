'use client'

import {Button, Input} from "@/app/components/ui";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {IRegisterInput} from "@/types/auth";
import authService from "@/services/authService";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import ROUTES from "@/config/routes";

export default function RegistrationForm() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<IRegisterInput>();

    const {mutate, isPending} = useMutation({
        mutationKey: ['registration'],
        mutationFn: (data: IRegisterInput) => authService.registration(data),
        onSuccess: () => {
            toast.success('Акаунт успішно створено!')
            router.push(ROUTES.CLIENTS)
            setTimeout(() => {
                toast.success('Додайте свого першого клієнта')
            }, 2000)
        }
    });

    const onSubmit = (data: IRegisterInput) => {
        mutate(data);
    };

    const password = watch("password");

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <h1>Реєстрація</h1>

        <Input
            disabled={isPending}
            type={'email'}
            placeholder={'Введіть ваш Email'}
            label={'Email'}
            error={errors.email?.message}
            {...register("email", {required: "Email обовʼязковий"})}
        />

        <Input
            disabled={isPending}
            placeholder={'Введіть назву компанії'}
            label={'Назва компанії'}
            error={errors.companyName?.message}
            {...register("companyName", {required: "Назва компанії обовʼязкова"})}
        />

        <Input
            disabled={isPending}
            withPasswordToggle
            label={'Пароль'}
            type={'password'}
            placeholder={'••••••••••'}
            error={errors.password?.message}
            {...register("password", {
                required: "Пароль обовʼязковий",
                minLength: {value: 6, message: "Мінімум 6 символів"}
            })}
        />

        <Input
            disabled={isPending}
            withPasswordToggle
            label={'Повторіть пароль'}
            type={'password'}
            placeholder={'••••••••••'}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
                required: "Підтвердження обовʼязкове",
                validate: (value) =>
                    value === password || "Паролі не співпадають",
            })}
        />

        <Button isLoading={isPending}>
            Створити акаунт
        </Button>

        <p className={'redirect-text'}>
            Вже маєте акаунт? <Link href={ROUTES.LOGIN}>Увійти</Link>
        </p>
    </form>)
}