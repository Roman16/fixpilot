import styles from './sidebar.module.scss'
import {NavLink} from "@/app/components/layout/Sidebar/components/NavLink";

import {
    Users,
    ClipboardList,
    Settings,
    ChartNoAxesCombined,
    IdCardLanyard,
    LogOut,
    Menu, X
} from "lucide-react";
import ROUTES from "@/config/routes";
import {ThemeToggle} from "@/app/components/layout/Sidebar/components/ThemeToggle";
import clsx from "clsx";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import authService from "@/services/authService";
import {useRouter} from "next/navigation";

const links = [
    // {href: "/", label: "Статистика", icon: <ChartNoAxesCombined size={18}/>},
    {href: ROUTES.ORDERS, label: "Замовлення", icon: <ClipboardList size={18}/>},
    {href: ROUTES.CLIENTS, label: "Клієнти", icon: <Users size={18}/>},
    {href: ROUTES.EMPLOYEES, label: "Працівники", icon: <IdCardLanyard size={18}/>},
    {href: ROUTES.PROFILE, label: "Профіль", icon: <Settings size={18}/>},
];

export const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter()

    const {mutate, isPending} = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            router.push(ROUTES.LOGIN)
        }
    });

    return (<aside className={styles.sidebar}>
        <div className={styles.logo}>
            Garage<span>OS</span>
        </div>

        <div className={clsx(styles.container, {
            [styles.opened]: isSidebarOpen
        })}>
            <nav className={styles.nav}>
                {links.map(link => <NavLink
                    key={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    {...link}
                />)}
            </nav>

            <div className={styles.footer}>
                <ThemeToggle/>

                <div className={clsx(styles.link, styles.logout)} onClick={() =>mutate()}>
                    <span className={styles.icon}><LogOut/></span>
                    <span className={styles.text}> Вийти</span>
                </div>
            </div>
        </div>

        <div className={styles.burger} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X/> :  <Menu /> }
        </div>
    </aside>)
}

const Logo = () => <svg height="70" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="40" fontFamily="Helvetica Neue, sans-serif" fontSize="40">
        <tspan fill="#7c4dff">Garage</tspan>
        <tspan fill="#000">OS</tspan>
    </text>
</svg>