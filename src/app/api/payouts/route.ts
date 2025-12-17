import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import Order from "@/models/Order";
import Payout from "@/models/Payout";
import Employee from "@/models/Employee";
import mongoose from "mongoose";
import {IWork} from "@/types/order";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const session = await getSession();

        if (!session?.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const {employeeId} = await req.json();

        if (!employeeId) {
            return NextResponse.json({message: "EmployeeId обовʼязковий"}, {status: 400});
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json({message: "Працівника не знайдено"}, {status: 404});
        }

        const orders = await Order.find({
            userId: session.id,
            status: "completed",
            "works.employeeId": employeeId,
            "works.payoutId": null
        });

        if (!orders.length) {
            return NextResponse.json({message: "Немає робіт для виплати"}, {status: 400});
        }

        let totalAmount = 0;
        const orderIds = new Set<mongoose.Types.ObjectId>();

        orders.forEach(order => {
            order.works.forEach((work: IWork) => {
                if (work.employeeId?.toString() === employeeId && !work.payoutId) {
                    totalAmount += work.price || 0;
                    orderIds.add(order._id);
                }
            });
        });

        const commissionAmount = Math.round(totalAmount * (employee.commission / 100));

        const payout = await Payout.create({
            userId: session.id,
            employeeId,
            totalAmount,
            totalCommission: commissionAmount,
            commission: employee.commission,
            orders: Array.from(orderIds)
        });

        // Проставляємо payoutId у роботах
        for (const order of orders) {
            let modified = false;

            order.works.forEach((work: IWork) => {
                if (work.employeeId?.toString() === employeeId && !work.payoutId) {
                    work.payoutId = payout._id;
                    modified = true;
                }
            });

            if (modified) {
                await order.save();
            }
        }

        return NextResponse.json(payout.toJSON(), {status: 201});
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            {message: "Помилка виплати"},
            {status: 500}
        );
    }
}