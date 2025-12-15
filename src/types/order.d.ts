import {IClient} from "@/types/client";
import {IVehicle} from "@/types/vehicles";
import {IPagination} from "@/types/common";

export type OrderStatus = "new" | "in_progress" | "completed" | "cancelled";

export interface IOrder {
    id: string;
    clientId: string;
    client?: IClient;
    vehicleId: string | null;
    vehicle?: IVehicle;
    mileage?: number;
    status: OrderStatus;
    works: IWork[];
    materials: IMaterial[];
    createdAt?: string;
    updatedAt?: string;
    closedAt?: string;
    orderNumber: number
}

export interface IWork {
    name?: string;
    price?: number;
    employeeId?: string;
}

export interface IMaterial {
    name?: string;
    price?: number;
}

export interface IOrdersResponse {
    data: IOrder[];
    pagination: IPagination;
}
