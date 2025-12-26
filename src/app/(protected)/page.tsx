"use client"

import {FC} from "react";
import {Dashboard} from "@/app/components/Dashbord/Dashboard";
import {Heading} from "@/app/components/layout/Heading/Heading";
import {redirect} from "next/navigation";
import ROUTES from "@/config/routes";

const ProtectedHomePage: FC = () =>{

    redirect(ROUTES.ORDERS)

    return(<div>
        <Heading title={'Статистика сервісу'}/>

        <Dashboard/>
    </div>)
}

export default ProtectedHomePage;
