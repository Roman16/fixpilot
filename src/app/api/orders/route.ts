import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextResponse} from "next/server";
import Order from "@/models/Order";
import Vehicle from "@/models/Vehicle";
import Client from "@/models/Client";
import mongoose from "mongoose";

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

        const skip = (page - 1) * limit;

        const userId = new mongoose.Types.ObjectId(session.id);

        const matchStage: any = {
            userId
        };

        if (search) {
            const regex = new RegExp(search, "i");

            matchStage.$or = [
                {"client.name": regex},
                {"client.phone": regex},
                {"vehicle.brand": regex},
                {"vehicle.model": regex},
                {"vehicle.plate": regex},
            ];
        }

        const result = await Order.aggregate([
            // user orders only
            {$match: {userId}},
            {
                $lookup: {
                    from: "clients",
                    localField: "clientId",
                    foreignField: "_id",
                    as: "client"
                }
            },
            {$unwind: "$client"},
            {
                $lookup: {
                    from: "vehicles",
                    localField: "vehicleId",
                    foreignField: "_id",
                    as: "vehicle"
                }
            },
            {$unwind: "$vehicle"},
            search ? {$match: matchStage} : {$match: {}},
            {$sort: {createdAt: -1}},
            {
                $addFields: {
                    id: {$toString: "$_id"}
                }
            },
            {
                $facet: {
                    data: [
                        {$skip: skip},
                        {$limit: limit}
                    ],
                    total: [
                        {$count: "count"}
                    ]
                }
            }
        ]);

        const orders = result[0].data;
        const total = result[0].total[0]?.count || 0;

        return NextResponse.json({
            data: orders,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
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
        const normalizedMileage = Number(mileage);

        const lastOrder = await Order.findOne().sort({createdAt: -1});
        const nextOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1;

        const newOrder = await Order.create({
            clientId,
            vehicleId,
            mileage: normalizedMileage,
            works,
            materials,
            status: "new",
            userId: session.id,
            orderNumber: nextOrderNumber,
        });

        await Client.findOneAndUpdate(
            {_id: clientId, userId: session.id},
            {$set: {visitAt: new Date() }}
        );

        await Vehicle.findOneAndUpdate(
            {
                _id: vehicleId,
                userId: session.id,
                $or: [
                    { mileage: { $exists: false } },
                    { mileage: null },
                    { $expr: { $lt: ['$mileage', normalizedMileage] } }
                ]
            },
            {
                $set: { mileage: normalizedMileage }
            }
        );

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
