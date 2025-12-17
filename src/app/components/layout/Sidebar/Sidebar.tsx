import styles from './sidebar.module.scss'
import {NavLink} from "@/app/components/layout/Sidebar/NavLink";

import {
    Users,
    ClipboardList,
    Settings,
    ChartNoAxesCombined,
    IdCardLanyard
} from "lucide-react";
import ROUTES from "@/config/routes";

const links = [
    {href: "/", label: "Статистика", icon: <ChartNoAxesCombined size={18}/>},
    {href: ROUTES.ORDERS, label: "Замовлення", icon: <ClipboardList size={18}/>},
    {href: ROUTES.CLIENTS, label: "Клієнти", icon: <Users size={18}/>},
    {href: ROUTES.EMPLOYEES, label: "Працівники", icon: <IdCardLanyard size={18}/>},
    {href: ROUTES.PROFILE, label: "Профіль", icon: <Settings size={18}/>},
];

export const Sidebar = () => {
    return (<aside className={styles.sidebar}>
        <div className={styles.logo}>
            <Logo/>
        </div>


        <nav className={styles.nav}>
            {links.map(link => <NavLink
                key={link.href}
                {...link}
            />)}
        </nav>
    </aside>)
}

const Logo = () => <svg width="300" height="70" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="40" fontFamily="Helvetica Neue, sans-serif" fontSize="40">
        <tspan fill="#7c4dff">Garage</tspan>
        <tspan fill="#000">OS</tspan>
    </text>
</svg>