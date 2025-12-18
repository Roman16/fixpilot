"use client"

import styles from "@/app/components/layout/Sidebar/sidebar.module.scss";
import Link from "next/link";
import {JSX} from "react";
import {usePathname} from "next/navigation";

interface NavLinkProps {
    href: string;
    label: string;
    onClick: () => void;
    icon: JSX.Element;
}

export const NavLink = ({href, icon, label, onClick}: NavLinkProps) => {
    const pathname = usePathname();

    const isActive =
        href === "/"
            ? pathname === "/"
            : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={`${styles.link} ${isActive ? styles.active : ""}`}
            onClick={onClick}
        >
            <span className={styles.icon}>{icon}</span>
            <span className={styles.text}> {label}</span>
        </Link>
    );
};