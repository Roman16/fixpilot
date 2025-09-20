import {Sidebar} from "@/app/components/layout/Sidebar/Sidebar";
import {ModalContainer as Modals} from "@/app/components/modals";

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (<div className={'page protected-page'}>
        <Sidebar/>

        <div className={'content'}>
            {children}
        </div>

        <Modals/>
    </div>);
}
