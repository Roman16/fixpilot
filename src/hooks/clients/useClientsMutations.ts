import {useMutation, useQueryClient} from '@tanstack/react-query';
import clientsService from '@/services/clientsService';
import {IClient} from '@/types/client';
import {IVehicle} from "@/types/vehicles";

export const useClientsMutations = () => {
    const queryClient = useQueryClient();

    const createClient = useMutation({
        mutationFn: (data: IClient) => clientsService.createClient(data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['clients']}),
    });

    const updateClient = useMutation({
        mutationFn: (data: IClient) => clientsService.updateClient(data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['clients']}),
    });

    const deleteClient = useMutation({
        mutationFn: (id: string) => clientsService.deleteClient(id),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['clients']}),
    });

    const createVehicle = useMutation({
        mutationFn: (data: { clientId: string, vehicle: IVehicle }) => clientsService.createVehicle(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['clients']})
        },
    })

    const updateVehicle = useMutation({
        mutationFn: (data: { vehicle: IVehicle }) => clientsService.updateVehicle(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['clients']})
        },
    })

    const deleteVehicle = useMutation({
        mutationFn: (data: { clientId: string, vehicleId: string }) => clientsService.deleteVehicle(data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['clients']}),
    });

    return {
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
        createVehicle: {
            mutateAsync: createVehicle.mutateAsync,
            isPending: createVehicle.isPending,
        },
        updateVehicle: {
            mutateAsync: updateVehicle.mutateAsync,
            isPending: updateVehicle.isPending,
        },
        deleteVehicle: {
            mutateAsync: deleteVehicle.mutateAsync,
            isPending: deleteVehicle.isPending,
        },
    };
};