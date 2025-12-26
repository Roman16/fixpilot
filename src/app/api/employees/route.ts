import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextResponse} from "next/server";
import Employee from "@/models/Employee";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }
        const body = await req.json();
        const {name, phone, commissionRate, role} = body;

        const newEmployee = await Employee.create({
            name,
            phone,
            commissionRate,
            role,
            userId: session.id,
        });

        return NextResponse.json({
            message: "Працівник створений успішно",
            data: {...newEmployee.toJSON()},
        }, {status: 201});
    } catch (error) {
        console.error("Create employee error:", error);
        return NextResponse.json({message: "Сталась помилка при створенні працівника"}, {status: 500});
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const userObjectId = new mongoose.Types.ObjectId(session.id);

        const res = await Employee.aggregate([
            {
                $match:{
                    userId: userObjectId,
                }
            },
            {
                $lookup: {
                    from: "payouts",
                    localField: "_id",
                    foreignField: "employeeId",
                    as: "payouts"
                }
            },
            {
                $addFields: {
                    id: "$_id"
                }
            },
            {
                $project: {
                    _id: 0,
                    __v: 0,
                }
            }
        ])

        return NextResponse.json({
            data: res,
        });
    } catch (error) {
        console.error("Load employees error:", error);
        return NextResponse.json({message: "Сталась помилка при отриманні працівників"}, {status: 500});
    }
}
