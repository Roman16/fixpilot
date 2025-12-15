import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextRequest, NextResponse} from "next/server";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const {id} = await params;

        const employeeObjectId = new mongoose.Types.ObjectId(id);
        const userObjectId = new mongoose.Types.ObjectId(session.id);

        const result = await Order.aggregate([
            {
                $match: {
                    userId: userObjectId,
                    status: "completed",
                }
            },
            {
                $lookup: {
                    from: "vehicles",
                    localField: "vehicleId",
                    foreignField: "_id",
                    as: "vehicle"
                }
            },
            {$unwind: "$vehicle"},
            {$unwind: "$works"},
            {
                $match: {
                    "works.employeeId": employeeObjectId,
                    "works.payoutId": null,
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "works.employeeId",
                    foreignField: "_id",
                    as: "employee"
                }
            },
            {$unwind: "$employee"},
            {
                $addFields: {
                    workCommission: {
                        $multiply: [
                            "$works.price",
                            { $divide: ["$employee.commission", 100] }
                        ]                    }
                }
            },

            {
                $group: {
                    _id: "$works.employeeId",
                    totalAmount: {$sum: "$works.price"},
                    totalCommission: { $sum: "$workCommission" },
                    works: {
                        $push: {
                            orderId: "$_id",
                            work: "$works.name",
                            price: "$works.price",
                            commission: "$workCommission",
                            vehicle: {
                                _id: "$vehicle._id",
                                brand: "$vehicle.brand",
                                model: "$vehicle.model",
                                plate: "$vehicle.plate",
                            }
                        }
                    }
                }
            }
        ]);

        return NextResponse.json(result[0] || {});
    } catch (error) {
        console.error("Load employees error:", error);
        return NextResponse.json({message: "Сталась помилка при отриманні працівників"}, {status: 500});
    }
}