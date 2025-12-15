import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import Order from "@/models/Order";

type RouteContext = {
    params: {
        id: string;
    };
};

export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        await connectToDatabase();
        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const { id } = context.params;

        if (!id) {
            return NextResponse.json({message: "ID замовлення обов’язкове"}, {status: 400});
        }

        const deleted = await Order.findOneAndDelete({
            _id: id,
            userId: session.id,
        });

        if (!deleted) {
            return NextResponse.json({message: "Замовлення не знайдено або вже видалено"}, {status: 404});
        }

        return NextResponse.json({message: "Замовлення успішно видалене"}, {status: 200});
    } catch (error) {
        console.error("Delete order error:", error);
        return NextResponse.json({message: "Сталась помилка при видаленні замовлення"}, {status: 500});
    }
}

export async function PATCH(req: Request, context: any) {
    try {
        const params = await context.params;
        const id = params.id;

        await connectToDatabase();
        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({ message: "Неавторизовано" }, { status: 401 });
        }

        const body = await req.json();

        if (!id || !body) {
            return NextResponse.json({ message: "ID і дані обов’язкові" }, { status: 400 });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: id, userId: session.id },
            {
                $set: {
                    status: body.status,
                    mileage: body.mileage,
                    works: body.works,
                    materials: body.materials,
                }
            },
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json(
                { message: "Замовлення не знайдено або оновлення не вдалося" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error("Update order error:", error);
        return NextResponse.json(
            { message: "Сталась помилка при оновленні замовлення" },
            { status: 500 }
        );
    }
}
