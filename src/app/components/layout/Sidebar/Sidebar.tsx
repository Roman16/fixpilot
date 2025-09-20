import styles from './sidebar.module.scss'
import {NavLink} from "@/app/components/layout/Sidebar/NavLink";

import {
    Home,
    Users,
    ClipboardList,
    Car,
    Settings
} from "lucide-react";
import ROUTES from "@/config/routes";

const links = [
    {href: "/dashboard", label: "Головна", icon: <Home size={18}/>},
    {href: ROUTES.CLIENTS, label: "Клієнти", icon: <Users size={18}/>},
    {href: "/orders", label: "Замовлення", icon: <ClipboardList size={18}/>},
    {href: "/vehicles", label: "Транспорт", icon: <Car size={18}/>},
    {href: ROUTES.PROFILE, label: "Профіль", icon: <Settings size={18}/>},
];

export const Sidebar = () => {

    return (<aside className={styles.sidebar}>
        <div className={styles.logo}>
            <svg width="250" height="70" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="40" fontFamily="Helvetica Neue, sans-serif" fontSize="50">
                    <tspan fill="#7c4dff">Fix</tspan>
                    <tspan fill="#000">Pilot</tspan>
                </text>
            </svg>
        </div>


        <nav className={styles.nav}>
            {links.map(link => <NavLink
                key={link.href}
                {...link}
            />)}
        </nav>
    </aside>)
}