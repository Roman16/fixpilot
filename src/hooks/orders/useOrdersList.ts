import { useQuery } from '@tanstack/react-query';
import ordersService from '@/services/ordersService';
import { IOrdersResponse } from '@/types/order';

export const useOrdersList = (
    page?: number,
    limit?: number,
    search: string = "",
    vehicleId?: string,
) => {
    return useQuery<IOrdersResponse>({
        queryKey: ['orders', page, limit, search, vehicleId],
        queryFn: () => ordersService.getOrders(page, limit, search, vehicleId),
        placeholderData: prev => prev,
    });
};
