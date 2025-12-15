import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextRequest, NextResponse} from "next/server";
import Vehicle from "@/models/Vehicle";


export async function DELETE(req: NextRequest, {params}: { params: Promise<{ id: string,  vehicleId: string}> }) {
    try {
        await connectToDatabase();
        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const {vehicleId} = await params;

        const deleted = await Vehicle.findOneAndDelete({_id: vehicleId, userId: session.id})

        if (!deleted) {
            return NextResponse.json({message: "ТЗ не знайдено або вже видалено"}, {status: 404});
        }

        return NextResponse.json({message: "ТЗ успішно видалений"}, {status: 200});
    } catch (error) {
        console.error("Delete client error:", error);
        return NextResponse.json({message: "Сталась помилка при видаленні ТЗ"}, {status: 500});
    }
}
