export interface IPayout {
    id: string,
    employeeId: string,
    totalAmount: number,
    totalCommission: number,
    employeeCommission: number,
    works: {
        id: string,
        name?: string,
        price?: number
    }[]
}