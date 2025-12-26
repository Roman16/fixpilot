import {useMutation, useQueryClient} from '@tanstack/react-query';
import employeesService from "@/services/employeesService";
import {IEmployee, IEmployeeFormValues} from "@/types/employee";
import toast from "react-hot-toast";

export const useEmployeesMutations = () => {
    const queryClient = useQueryClient();

    const createEmployee = useMutation<
        { data: IEmployee },
        Error,
        IEmployeeFormValues
    >({
        mutationFn: (data: IEmployeeFormValues) => employeesService.createEmployee(data),
        onSuccess: (res) => {
            queryClient.setQueryData<{data: IEmployee[]}>(
                ['employees'],
                (oldData) => {
                    if (!oldData) return {data: [res.data]};

                    return {
                        ...oldData,
                        data: [...oldData.data, res.data],
                    };
                }
            );

            toast.success('Працівник успішно створений');
        },
    });

    const updateEmployee = useMutation({
        mutationFn: (data: IEmployee) => employeesService.updateEmployee(data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['employees']}),
    });

    const deleteEmployee = useMutation({
        mutationFn: (id: string) => employeesService.deleteEmployee(id),
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData(['employees'], (oldData: any) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    data: oldData.data.filter(
                        (employee: IEmployee) => employee.id !== deletedId
                    )
                };
            });
            toast.success('Працівник успішно видалений');
        },
        onError: () => {
            toast.error('Помилка при видаленні працівника');
        }
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