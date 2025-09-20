import {baseService} from "@/services/baseService";
import {IClientsResponse, IClient} from "@/types/client";


class clientsService extends baseService {
    getClients() {
        return this.get<IClientsResponse>('/clients');
    }

    createClient(data: IClient) {
        return this.post('/clients', data);
    }

    updateClient(data: IClient,) {
        return this.patch(`/clients/${data.id}`, data);
    }

    deleteClient(id: string) {
        return this.delete(`/clients/${id}`);
    }

}

export default new clientsService();