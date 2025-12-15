"use client"

import {FC} from "react";
import {Dashboard} from "@/app/components/Dashbord/Dashboard";
import {Heading} from "@/app/components/layout/Heading/Heading";

const ProtectedHomePage: FC = () =>{
    return(<div>
        <Heading title={'Статистика сервісу'}/>

        <Dashboard/>
    </div>)
}

export default ProtectedHomePage;
