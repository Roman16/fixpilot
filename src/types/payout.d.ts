export interface IPayout {
    id: string,
    createdAt?: string,
    employeeId: string,
    totalAmount: number,
    totalCommission: number,
    commission: number,
    works: {
        id: string,
        name?: string,
        price?: number
    }[]
}