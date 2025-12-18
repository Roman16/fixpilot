'use client';

import '../styles/global.scss';
import {Providers} from './providers'
import {Toaster} from "react-hot-toast";
import {useEffect} from "react";
import {useThemeStore} from "@/store/themeStore";

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    const initTheme = useThemeStore((s) => s.initTheme);

    useEffect(() => {
        initTheme();
    }, [initTheme]);

    return (
        <html lang="en">
        <body>
        <Providers>
            {children}

            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '12px 16px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#22c55e',
                            secondary: '#1e1e1e',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#1e1e1e',
                        },
                    },
                }}
            />
        </Providers>
        </body>
        </html>
    );
}
