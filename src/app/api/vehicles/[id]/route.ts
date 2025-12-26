import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextResponse} from "next/server";
import Vehicle from "@/models/Vehicle";

export async function PATCH(req: Request, context: any) {
    try {
        const params = await context.params;
        const id = params.id;

        await connectToDatabase();
        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const {brand, model, year, mileage, plate, vin} = await req.json();

        if (!id) {
            return NextResponse.json({message: "ID і дані обов’язкові"}, {status: 400});
        }

        const updatedEmployee = await Vehicle.findOneAndUpdate(
            {
                userId: session.id,
                _id: id
            },
            {
                $set: {
                    brand,
                    model,
                    year,
                    mileage,
                    plate,
                    vin,
                }
            },
            {new: true}
        );

        if (!updatedEmployee) {
            return NextResponse.json(
                {message: "ТЗ не знайдено або оновлення не вдалося"},
                {status: 404}
            );
        }

        return NextResponse.json(updatedEmployee, {status: 200});
    } catch (error) {
        console.error("Update vehicle error:", error);
        return NextResponse.json(
            {message: "Сталась помилка при оновленні ТЗ"},
            {status: 500}
        );
    }
}
