import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextResponse} from "next/server";
import Order from "@/models/Order";
import Vehicle from "@/models/Vehicle";
import Client from "@/models/Client";

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

        const [orders, total] = await Promise.all([
            Order.find(query)
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit),
            Order.countDocuments(query),
        ]);

        const preparedOrders = await Promise.all(orders.map(async (order) => {
            const client = await Client.findById(order.clientId);
            const vehicle = await Vehicle.findById(order.vehicleId);

            return {
                ...order.toJSON(),
                vehicle,
                client
            };
        }));

        return NextResponse.json({
            data: preparedOrders,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Load orders error:", error);
        return NextResponse.json({message: "Сталась помилка при отриманні замовлень"}, {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }
        const body = await req.json();
        const {clientId, vehicleId, mileage, works, materials} = body;

        const lastOrder = await Order.findOne().sort({ createdAt: -1 });
        const nextOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

        const newOrder = await Order.create({
            clientId,
            vehicleId,
            mileage,
            works,
            materials,
            status: "new",
            userId: session.id,
            orderNumber: nextOrderNumber,
        });

        const client = await Client.findById(clientId);
        const vehicle = await Vehicle.findById(vehicleId);

        const preparedOrder = {
            ...newOrder.toJSON(),
            client,
            vehicle,
        };

        return NextResponse.json({
            message: "Замовлення створено успішно",
            data: preparedOrder,
        }, {status: 201});
    } catch (error) {
        console.error("Create orders error:", error);
        return NextResponse.json({message: "Сталась помилка при створенні замовлення"}, {status: 500});
    }
}
