"use client"

import styles from "@/app/components/layout/Sidebar/sidebar.module.scss";
import Link from "next/link";
import {JSX} from "react";
import {usePathname} from "next/navigation";

interface NavLinkProps {
    href: string;
    label: string;
    icon: JSX.Element;
}

export const NavLink = ({href, icon, label}:NavLinkProps) => {
    const pathname = usePathname();

    return(<Link
        href={href}
        className={`${styles.link} ${pathname.startsWith(href) ? styles.active : ""}`}
    >
        <span className={styles.icon}>{icon}</span>
        {label}
    </Link>)
}