import {useMutation, useQuery} from '@tanstack/react-query';
import supplierService from "@/services/SupplierService";


export function useSupplierBrands() {
    return useQuery({
        queryKey: ['supplier', 'brands'],
        queryFn: () => supplierService.getBrands(),
        staleTime: 24 * 60 * 60 * 1000,
        retry: false,
    });
}

export function useSupplierModels(brandId: number | null) {
    return useQuery({
        queryKey: ['supplier', 'models', brandId],
        queryFn: () => supplierService.getModels(brandId!),
        enabled: !!brandId,
        staleTime: 24 * 60 * 60 * 1000,
        retry: false,
    });
}

export function useSupplierCatalog(modelId: number | null) {
    return useQuery({
        queryKey: ['supplier', 'catalog', modelId],
        queryFn: () => supplierService.getCatalog(modelId!),
        enabled: !!modelId,
        staleTime: 60 * 60 * 1000,
        retry: false,
    });
}

export interface SupplierSubModel { id: number; name: string }

export function useSupplierSubModels(modelId: number | null) {
    return useQuery({
        queryKey: ['supplier', 'submodels', modelId],
        queryFn: () => supplierService.getSubModels(modelId!),
        enabled: !!modelId,
        staleTime: 24 * 60 * 60 * 1000,
        retry: false,
    });
}

export function useSupplierParts(modelId: number | null, nodeId: number | null) {
    return useQuery({
        queryKey: ['supplier', 'parts', modelId, nodeId],
        queryFn: () => supplierService.getParts(modelId!, nodeId!),
        enabled: !!modelId && !!nodeId,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}

export function useAddToSupplierOrder() {
    return useMutation({
        mutationFn: ({wareCode, qty}: {wareCode: number; qty: number}) =>
            supplierService.addToOrder(wareCode, qty),
    });
}