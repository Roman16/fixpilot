import { create } from 'zustand';

export type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: 'light',

    setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        set({ theme });
    },

    toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(next);
    },

    initTheme: () => {
        if (typeof window === 'undefined') return;

        const saved = localStorage.getItem('theme') as Theme | null;
        const system =
            window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';

        const theme = saved ?? system;
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
    },
}));
