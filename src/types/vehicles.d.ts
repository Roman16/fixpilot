export interface IVehicle {
    id: string,
    userId: string,
    clientId: string,
    brand: string,
    model: string,
    year?: string,
    mileage?: number,
    plate?: string,
    vin?: string,
}