import {IPayout} from "@/types/payout";

export interface IEmployee {
    id: string;
    name?: string;
    phone?: string;
    role?: string;
    commission?: number | null;
    payouts?: IPayout[]
}

export interface IEmployeesResponse {
    data: IEmployee[];
}
