import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextRequest, NextResponse} from "next/server";
import Vehicle from "@/models/Vehicle";

type RouteContext = {
    params: {
        id: string;
        vehicleId: string
    };
};

export async function DELETE(
    request: NextRequest,
    context: RouteContext
) {
    try {
        await connectToDatabase();
        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const deleted = await Vehicle.findOneAndDelete({_id: context.params.vehicleId, userId: session.id})

        if (!deleted) {
            return NextResponse.json({message: "ТЗ не знайдено або вже видалено"}, {status: 404});
        }

        return NextResponse.json({message: "ТЗ успішно видалений"}, {status: 200});
    } catch (error) {
        console.error("Delete client error:", error);
        return NextResponse.json({message: "Сталась помилка при видаленні ТЗ"}, {status: 500});
    }
}
