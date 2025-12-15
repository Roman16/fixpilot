import {baseService} from "@/services/baseService";
import {IEmployee, IEmployeesResponse} from "@/types/employee";
import {IPayout} from "@/types/payout";

class employeesService extends baseService {
    getEmployees() {
        return this.get<IEmployeesResponse>('/employees');
    }

    createEmployee(data: IEmployee) {
        return this.post('/employees', data);
    }

    updateEmployee(data: IEmployee) {
        return this.patch(`/employees/${data.id}`, data);
    }

    deleteEmployee(id: string) {
        return this.delete(`/employees/${id}`);
    }

    getEmployeeBalance(id: string) {
        return this.get<IPayout>(`/employees/${id}/balance`);
    }
}

export default new employeesService();