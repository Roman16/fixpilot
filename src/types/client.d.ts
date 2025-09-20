import {IPagination} from "@/types/common";

export interface IClient {
    id?: string;
    name: string;
    phone: string;
    comment?: string;
}

export interface IClientsResponse {
    data: IClient[];
    pagination: IPagination;
}
