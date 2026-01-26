import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextResponse} from "next/server";
import Order from "@/models/Order";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectToDatabase();

        const session = await getSession();
        if (!session || !session.id) {
            return NextResponse.json({ message: "Неавторизовано" }, { status: 401 });
        }

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
            { $unwind: "$vehicle" },
            { $unwind: "$works" },

            {
                $match: {
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
            { $unwind: "$employee" },

            {
                $addFields: {
                    workCommission: {
                        $multiply: [
                            "$works.price",
                            { $divide: ["$employee.commissionRate", 100] }
                        ]
                    }
                }
            },

            {
                $group: {
                    _id: "$employee._id",
                    employee: {
                        $first: {
                            _id: "$employee._id",
                            name: "$employee.name",
                            commissionRate: "$employee.commissionRate",
                        }
                    },
                    totalAmount: { $sum: "$works.price" },
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
            },
            {
                $addFields: {
                    id: "$_id"
                }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {
                    "employee.name": 1
                }
            }
        ]);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Load employees balance error:", error);
        return NextResponse.json(
            { message: "Сталась помилка при отриманні балансів працівників" },
            { status: 500 }
        );
    }
}
