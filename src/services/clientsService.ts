import {baseService} from "@/services/baseService";
import {IClientsResponse, IClient} from "@/types/client";
import {IVehicle} from "@/types/vehicles";


class clientsService extends baseService {
    getClients(page: number = 1, limit: number = 20, search: string = "") {
        return this.get<IClientsResponse>('/clients', {
            params: { page, limit, search }
        });
    }

    createClient(data: IClient) {
        return this.post<{data: IClient}>('/clients', data);
    }

    updateClient(data: IClient,) {
        return this.patch(`/clients/${data.id}`, data);
    }

    deleteClient(id: string) {
        return this.delete(`/clients/${id}`);
    }

    createVehicle(data: {clientId: string, vehicle: IVehicle}) {
        return this.post(`/clients/${data.clientId}/vehicles`, data.vehicle);
    }

    updateVehicle(data: { vehicle: IVehicle}) {
        return this.patch(`/vehicles/${data.vehicle.id}`, data.vehicle);
    }

    deleteVehicle(data: {clientId: string, vehicleId: string}) {
        return this.delete(`/clients/${data.clientId}/vehicles/${data.vehicleId}`);
    }

}

export default new clientsService();