import { baseService } from '@/services/baseService';
import {SupplierPart, SupplierSubModel} from "@/lib/supplierParser";

export interface SupplierBrand { id: number; name: string }
export interface SupplierModel { id: number; name: string }
export interface SupplierCatalogNode { id: number; name: string; parentId: number | null }

class SupplierService extends baseService {
    async getBrands() {
        const res = await this.get<{ data: SupplierBrand[] }>('/supplier/brands');
        return res.data;
    }

    async getModels(brandId: number) {
        const res = await this.get<{ data: SupplierModel[] }>(`/supplier/models?brandId=${brandId}`);
        return res.data;
    }

    async getCatalog(modelId: number) {
        const res = await this.get<{ data: SupplierCatalogNode[] }>(`/supplier/catalog?modelId=${modelId}`);
        return res.data;
    }

    async getSubModels(modelId: number) {
        const res = await this.get<{ data: SupplierSubModel[] }>(`/supplier/submodels?modelId=${modelId}`);
        return res.data;
    }

    async getParts(modelId: number, nodeId: number) {
        const res = await this.get<{ data: SupplierPart[] }>(`/supplier/parts?modelId=${modelId}&nodeId=${nodeId}`);
        return res.data;
    }

    async addToOrder(wareCode: number, qty: number = 1) {
        return this.post<{ message: string; orderId: string }>('/supplier/order', {wareCode, qty});
    }
}

export default new SupplierService();