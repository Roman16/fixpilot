import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextRequest, NextResponse} from "next/server";
import Vehicle from "@/models/Vehicle";

export async function POST(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();

        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const {brand, model, year, mileage, plate, vin} = await req.json();
        const {id: clientId} = await params;

        const newVehicle = await Vehicle.create({
            userId: session.id,
            clientId,

            brand,
            model,
            year,
            mileage,
            plate,
            vin
        });

        return NextResponse.json({
            message: "Транспортний засіб створений успішно",
            data: {...newVehicle.toJSON()},
        }, {status: 201});
    } catch (error) {
        console.error("Create clients error:", error);
        return NextResponse.json({message: "Сталась помилка при створенні транспортний засіб"}, {status: 500});
    }
}