import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {generateShareToken} from "@/lib/shareToken";
import {NextResponse} from "next/server";
import Vehicle from "@/models/Vehicle";

export async function POST(_req: Request, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const {id} = await params;

        // токен є в усіх нових ТЗ, для старих створюємо його при першому запиті
        const vehicle = await Vehicle.findOneAndUpdate(
            {_id: id, userId: session.id, shareToken: {$exists: false}},
            {$set: {shareToken: generateShareToken()}},
            {new: true}
        ) ?? await Vehicle.findOne({_id: id, userId: session.id});

        if (!vehicle) {
            return NextResponse.json({message: "ТЗ не знайдено"}, {status: 404});
        }

        return NextResponse.json({token: vehicle.shareToken});
    } catch (error) {
        console.error("Share vehicle error:", error);
        return NextResponse.json({message: "Сталась помилка при створенні посилання"}, {status: 500});
    }
}
