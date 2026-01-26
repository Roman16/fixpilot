import {baseService} from "@/services/baseService";
import {ICreateEmployeeDto, IEmployee, IUpdateEmployeeDto} from "@/types/employee";
import {IPayout} from "@/types/payout";

class employeesService extends baseService {
    getEmployees() {
        return this.get<{ data: IEmployee[] }>('/employees');
    }

    createEmployee(data: ICreateEmployeeDto) {
        return this.post<{ data: IEmployee }>('/employees', data);
    }

    updateEmployee(data: IUpdateEmployeeDto) {
        return this.patch(`/employees/${data.id}`, data);
    }

    deleteEmployee(id: string) {
        return this.delete(`/employees/${id}`);
    }

    getEmployeesBalance() {
        return this.get<IPayout[]>(`/employees/balance`);
    }

    payoutEmployees() {
        return this.post('/payouts')
    }
}

export default new employeesService();