export interface IPayout {
    id: string,
    createdAt?: string,
    employeeId: string,
    employee: IEmployee,
    totalAmount: number,
    totalCommission: number,
    commission: number,
    works: {
        id: string,
        name?: string,
        price?: number
    }[]
}