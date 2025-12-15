import {IPagination} from "@/types/common";
import {IVehicle} from "@/types/vehicles";

export interface IClient {
    id: string;
    name: string;
    phone: string;
    comment?: string;
    vehicles?: IVehicle[];
}

export interface IClientsResponse {
    data: IClient[];
    pagination: IPagination;
}
