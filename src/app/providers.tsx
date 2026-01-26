'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactNode, useEffect} from 'react'
import {useThemeStore} from "@/store/themeStore";

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
    const initTheme = useThemeStore((s) => s.initTheme);
    // useReportWebVitals((metric) => {
    //     console.log(metric);
    // });
    useEffect(() => {
        initTheme();
    }, [initTheme]);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
