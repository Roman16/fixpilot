import {useQuery} from '@tanstack/react-query';
import {IClientsResponse} from "@/types/client";
import clientsService from "@/services/clientsService";

export const useClientsList = (
    page?: number,
    limit?: number,
    search: string = ""
) => {
    return useQuery<IClientsResponse>({
        queryKey: ['clients', page, limit, search],
        queryFn: () => clientsService.getClients(page, limit, search),
        placeholderData: (previousData) => previousData,
    });
};