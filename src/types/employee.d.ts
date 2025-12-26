import {IPayout} from "@/types/payout";

export interface IEmployeeFormValues {
    name: string;
    phone: string;
    role: string;
    commissionRate: number | null;
}

export interface IEmployee extends IEmployeeFormValues {
    id: string;
    payouts?: IPayout[];
    earnings?: {
        totalEarned: number;
        totalPaid: number;
    };
}

export interface ICreateEmployeeDto {
    name: string;
    phone: string;
    role: string;
    commissionRate: number | null;
}

export interface IUpdateEmployeeDto extends ICreateEmployeeDto {
    id: string;
}