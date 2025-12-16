import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import Client from "@/models/Client";
import Vehicle from "@/models/Vehicle";
import {IVehicle} from "@/types/vehicles";

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }
        const body = await req.json();
        const {name, phone, comment, vehicles = []} = body;

        const newClient = await Client.create({
            name,
            phone,
            comment,
            userId: session.id,
        });

        let createdVehicles: any[] = [];

        if (vehicles.length > 0 && !!vehicles[0].brand) {
            const vehiclesToCreate = vehicles.map((v: IVehicle) => ({
                userId: session.id,
                clientId: newClient._id,
                brand: v.brand,
                model: v.model,
                plate: v.plate,
                year: v.year,
                vin: v.vin,
                mileage: v.mileage
            }));

            createdVehicles = await Vehicle.insertMany(vehiclesToCreate);
        }

        const clientWithVehicles = {
            ...newClient.toJSON(),
            vehicles: createdVehicles.map(v => v.toJSON()),
        };

        return NextResponse.json({
            message: "Клієнт створений успішно",
            data: clientWithVehicles,
        }, {status: 201});
    } catch (error) {
        console.error("Create clients error:", error);
        return NextResponse.json({message: "Сталась помилка при створенні клієнта"}, {status: 500});
    }
}

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const {searchParams} = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search")?.trim() || "";

        const query: any = {
            userId: session.id,
        };

        if (search) {
            query.$or = [
                {name: {$regex: search, $options: "i"}},
                {phone: {$regex: search, $options: "i"}},
            ];
        }

        const skip = (page - 1) * limit;

        const [clients, total] = await Promise.all([
            Client.find(query)
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit),
            Client.countDocuments(query),
        ]);

        const clientsWithVehicles = await Promise.all(clients.map(async (client) => {
            const vehicles = await Vehicle.find({clientId: client._id});
            return {
                ...client.toJSON(),
                vehicles,
            };
        }));

        return NextResponse.json({
            data: clientsWithVehicles,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Load clients error:", error);
        return NextResponse.json({message: "Сталась помилка при отриманні клієнтів"}, {status: 500});
    }
}
