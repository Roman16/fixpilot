import {CheckCircle2, LayoutDashboard, Users} from "lucide-react";


export const AuthDetails = () => {

    return (<div className={'auth-details'}>
        <div className="auth-details__container">
            <h1>GarageOS — операційна система твого успіху</h1>
            <p>Ми не просто софт. Ми — ваш цифровий помічник, який закриває питання обліку, щоб ви могли робити те, що
                любите.</p>

            <ul className="">
                {[
                    {icon: LayoutDashboard, text: "Прозорий облік кожного гвинтика"},
                    {icon: CheckCircle2, text: "Зарплати, що рахуються самі"},
                    {icon: Users, text: "Клієнти, які повертаються знову"}
                ].map((item, i) => (
                    <li key={i}>
                        <item.icon className="h-6 w-6 text-primary"/>
                        <span className="font-medium text-lg">{item.text}</span>
                    </li>
                ))}
            </ul>
        </div>

    </div>)
}