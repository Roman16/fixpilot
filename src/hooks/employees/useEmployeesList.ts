import {useQuery} from '@tanstack/react-query';
import employeesService from "@/services/employeesService";
import {IEmployeesResponse} from "../../types/employee";

export const useEmployeesList = () => {
    return useQuery<IEmployeesResponse>({
        queryKey: ['employees'],
        queryFn: () => employeesService.getEmployees(),
        placeholderData: (previousData) => previousData,
    });
};