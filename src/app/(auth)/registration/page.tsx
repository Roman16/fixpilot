import RegistrationForm from "@/app/components/forms/RegistrationForm/RegistrationForm";
import {AuthDetails} from "@/app/(auth)/login/AuthDetails";

export default function RegistrationPage() {
    return (
        <div className="page auth-page registration-page">
            <div className={'auth-page__form-container'}>
                <h2>Вітаємо у GarageOS</h2>
                <p>Платформа для тих, хто цінує порядок та швидкість</p>
                <RegistrationForm/>
            </div>

            <AuthDetails/>
        </div>
    );
}
