'use client';

import {Sidebar} from "@/app/components/layout/Sidebar/Sidebar";
import {ModalContainer as Modals} from "@/app/components/modals";
import {useQuery} from "@tanstack/react-query";
import profileService from "@/services/profileService";
import {Loader} from "@/app/components/ui/Loader/Loader";

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    const {
        data: profile,
        isLoading
    } = useQuery({
        queryKey: ['profile'],
        queryFn: () => profileService.getProfile(),
        staleTime: Infinity,
    });

    if (isLoading) {
        return <div className={'main-loader'}><Loader/></div>;
    }

    return (<div className={'page protected-page'}>
        <Sidebar/>

        <div
            className={'content'}
            style={
                profile?.logo
                    ? { ['--company-logo' as any]: `url(${profile.logo})` }
                    : undefined
            }
        >
            {children}
        </div>

        <Modals/>
    </div>);
}
