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

    const {register, handleSubmit} = useForm<IRegisterInput>();

    const {mutate, isPending} = useMutation({
        mutationKey: ['registration'],
        mutationFn: (data: IRegisterInput) => authService.registration(data),
        onSuccess: () => {
            toast.success('Акаунт успішно створено!')
            router.push(ROUTES.LOGIN)
        }
    });

    const onSubmit = (data: IRegisterInput) => {
        if (data.password !== data.confirmPassword) {
            return;
        }

        mutate(data);
    };

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <h1>Реєстрація</h1>

        <Input
            disabled={isPending}
            type={'email'}
            placeholder={'Введіть ваш Email'}
            label={'Email'}
            {...register("email", {required: "Email обовʼязковий"})}
        />

        <Input
            disabled={isPending}
            placeholder={'Введіть назву компанії'}
            label={'Назва компанії'}
            {...register("company", {required: "Назва компанії обовʼязкова"})}
        />

        <Input
            disabled={isPending}
            label={'Пароль'}
            type={'password'}
            placeholder={'••••••••••'}
            {...register("password", {
                required: "Пароль обовʼязковий",
                minLength: {value: 6, message: "Мінімум 6 символів"}
            })}
        />

        <Input
            disabled={isPending}
            label={'Повторіть пароль'}
            type={'password'}
            placeholder={'••••••••••'}
            {...register("confirmPassword", {required: "Підтвердження обовʼязкове"})}
        />

        <Button isLoading={isPending}>
            Створити акаунт
        </Button>

        <p className={'redirect-text'}>
            Вже маєте акаунт? <Link href={ROUTES.LOGIN}>Увійти</Link>
        </p>
    </form>)
}