import '../styles/global.scss';
import {Providers} from './providers'
import {Toaster} from "react-hot-toast";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
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
