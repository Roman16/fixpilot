import { useMutation, useQueryClient } from '@tanstack/react-query';
import ordersService from '@/services/ordersService';
import { IOrder } from '@/types/order';

export const useOrdersMutations = () => {
    const queryClient = useQueryClient();

    const createOrder = useMutation({
        mutationFn: (data: IOrder) => ordersService.createOrder(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    });

    const updateOrder = useMutation({
        mutationFn: (data: IOrder) => ordersService.updateOrder(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    });

    const deleteOrder = useMutation({
        mutationFn: (id: string) => ordersService.deleteOrder(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    });

    return { createOrder, updateOrder, deleteOrder };
};
