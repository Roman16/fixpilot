export interface IEmployee {
    id: string;
    name?: string;
    phone?: string;
    role?: string;
    commission?: number | null;
}

export interface IEmployeesResponse {
    data: IEmployee[];
}
