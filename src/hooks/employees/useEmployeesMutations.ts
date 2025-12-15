import {useMutation, useQueryClient} from '@tanstack/react-query';
import employeesService from "@/services/employeesService";
import {IEmployee} from "@/types/employee";

export const useEmployeesMutations = () => {
    const queryClient = useQueryClient();

    const createEmployee = useMutation({
        mutationFn: (data: IEmployee) => employeesService.createEmployee(data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['employees']}),
    });

    const updateEmployee = useMutation({
        mutationFn: (data: IEmployee) => employeesService.updateEmployee(data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['employees']}),
    });

    const deleteEmployee = useMutation({
        mutationFn: (id: string) => employeesService.deleteEmployee(id),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['employees']}),
    });

    return {
        createEmployee: {
            mutateAsync: createEmployee.mutateAsync,
            isPending: createEmployee.isPending,
        },
        updateEmployee: {
            mutateAsync: updateEmployee.mutateAsync,
            isPending: updateEmployee.isPending,
        },
        deleteEmployee: {
            mutateAsync: deleteEmployee.mutateAsync,
            isPending: deleteEmployee.isPending,
        },
    };
};