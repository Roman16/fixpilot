import {connectToDatabase} from "@/lib/db";
import Vehicle from "@/models/Vehicle";
import Order from "@/models/Order";
import User from "@/models/User";

export interface PublicVehicleHistory {
    service: { name: string; phone: string; address: string; logo: string };
    vehicle: { brand: string; model: string; year: string; plate: string; vin: string; mileage: number | null };
    orders: {
        id: string;
        date: string | null;
        mileage: number | null;
        works: { name: string; price: number }[];
        materials: { name: string; count: number; price: number }[];
        worksTotal: number;
        materialsTotal: number;
    }[];
}

// Навмисно віддаємо лише те, що можна показувати стороннім:
// без даних клієнта і співробітників.
export async function getPublicVehicleHistory(token: string): Promise<PublicVehicleHistory | null> {
    if (!/^[a-f0-9]{32}$/.test(token)) return null;

    await connectToDatabase();

    const vehicle = await Vehicle.findOne({shareToken: token}).lean<any>();
    if (!vehicle) return null;

    const [user, orders] = await Promise.all([
        User.findById(vehicle.userId).lean<any>(),
        Order.find({vehicleId: vehicle._id, userId: vehicle.userId, status: {$in: ['completed', 'archived']}})
            .sort({createdAt: -1})
            .lean(),
    ]);

    return {
        service: {
            name: user?.companyName || '',
            phone: user?.phone || '',
            address: user?.address || '',
            logo: user?.logo || '',
        },
        vehicle: {
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year || '',
            plate: vehicle.plate || '',
            vin: vehicle.vin || '',
            mileage: vehicle.mileage ?? null,
        },
        orders: orders.map((order: any) => {
            const date = order.closedAt || order.createdAt;

            const works = (order.works ?? [])
                .filter((w: any) => w?.name)
                .map((w: any) => ({name: w.name, price: w.price ?? 0}));
            const materials = (order.materials ?? [])
                .filter((m: any) => m?.name)
                .map((m: any) => ({name: m.name, count: m.count ?? 1, price: m.price ?? 0}));

            return {
                id: order._id.toString(),
                date: date ? new Date(date).toISOString() : null,
                mileage: order.mileage ?? null,
                works,
                materials,
                worksTotal: works.reduce((acc: number, w: any) => acc + w.price, 0),
                materialsTotal: materials.reduce((acc: number, m: any) => acc + m.price * m.count, 0),
            };
        }),
    };
}
