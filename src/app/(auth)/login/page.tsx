import LoginForm from "@/app/components/forms/LoginForm/LoginForm";
import {AuthDetails} from "@/app/(auth)/login/AuthDetails";

export default function LoginPage() {
    return (
        <div className="page auth-page login-page">
            <div className={'auth-page__form-container'}>
                <h2>Вітаємо у GarageOS</h2>
                <p>Платформа для тих, хто цінує порядок та швидкість</p>
                <LoginForm/>
            </div>

            <AuthDetails/>
        </div>
    );
}
