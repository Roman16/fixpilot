'use client';

import { useThemeStore } from '@/store/themeStore';
import styles from '../sidebar.module.scss';
import {Moon, Sun} from "lucide-react";
import clsx from "clsx";

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={clsx(styles.link, styles.toggle)}
            aria-label="Змінити тему"
        >
      <span className={styles.icon}>
        {/*{theme === 'dark' ? '🌙' : '☀️'}*/}
        {theme === 'dark' ? <Moon /> : <Sun />}
      </span>
        </button>
    );
};
