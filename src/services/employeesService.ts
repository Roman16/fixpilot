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

    getEmployeeBalance(id: string) {
        return this.get<IPayout>(`/employees/${id}/balance`);
    }

    payoutEmployee(employeeId: string) {
        return this.post('/payouts', {employeeId})
    }
}

export default new employeesService();