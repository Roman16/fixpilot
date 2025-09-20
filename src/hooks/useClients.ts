import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clientsService from '@/services/clientsService';
import { IClient, IClientsResponse } from '@/types/client';

export const useClients = () => {
    const queryClient = useQueryClient();

    const getClients = useQuery<IClientsResponse>({
        queryKey: ['clients'],
        queryFn: () => clientsService.getClients(),
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        placeholderData: (prev) => prev,
    });

    const createClient = useMutation({
        mutationFn: (data: IClient) => clientsService.createClient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });

    const updateClient = useMutation({
        mutationFn: (data: IClient) => clientsService.updateClient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });

    const deleteClient = useMutation({
        mutationFn: (id: string) => clientsService.deleteClient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        },
    });

    return {
        getClients,
        createClient: {
            mutateAsync: createClient.mutateAsync,
            isPending: createClient.isPending,
        },
        updateClient: {
            mutateAsync: updateClient.mutateAsync,
            isPending: updateClient.isPending,
        },
        deleteClient: {
            mutateAsync: deleteClient.mutateAsync,
            isPending: deleteClient.isPending,
        },
    };
};
