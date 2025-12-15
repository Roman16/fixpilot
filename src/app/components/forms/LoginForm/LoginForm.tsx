'use client'

import {Button, Input} from "@/app/components/ui";
import Link from "next/link";
import ROUTES from "@/config/routes";
import {useForm} from "react-hook-form";
import {IRegisterInput} from "@/types/auth";
import {useMutation} from "@tanstack/react-query";
import authService from "@/services/authService";
import {useRouter} from "next/navigation";

export default function LoginForm() {
    const router = useRouter()

    const {register, handleSubmit} = useForm<IRegisterInput>();

    const {mutate, isPending} = useMutation({
        mutationKey: ['login'],
        mutationFn: (data: IRegisterInput) => authService.login(data),
        onSuccess: () => {
            router.push(ROUTES.CLIENTS)
        }
    });

    const onSubmit = (data: IRegisterInput) => {
        mutate(data);
    };

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <h1>Авторизація</h1>

        <Input
            disabled={isPending}
            type={'email'}
            placeholder={'Введіть ваш Email'}
            label={'Email'}
            {...register("email", {required: "Email обовʼязковий"})}
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

        <Button type={'submit'} isLoading={isPending}>Увійти</Button>

        <p className={'redirect-text'}>
            Не маєте акаунту? <Link href={ROUTES.REGISTRATION}>Зареєструватися</Link>
        </p>
    </form>)
}