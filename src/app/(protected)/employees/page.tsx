import {Heading} from "@/app/components/layout/Heading/Heading";
import {Employees} from "@/app/(protected)/employees/Employees";

export default function EmployeesPage() {
    return (<div className={'employees-page'}>
        <Heading
            title={'Працівники'}
            actionType={'employeeModal'}
            actionBtnText={'Додати працівника'}
        />

        <Employees/>
    </div>)
}