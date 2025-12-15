import { useQuery } from '@tanstack/react-query';
import ordersService from '@/services/ordersService';
import { IOrdersResponse } from '@/types/order';

export const useOrdersList = (
    page?: number,
    limit?: number,
    search: string = ""
) => {
    return useQuery<IOrdersResponse>({
        queryKey: ['orders', page, limit, search],
        queryFn: () => ordersService.getOrders(page, limit, search),
        placeholderData: prev => prev,
    });
};
