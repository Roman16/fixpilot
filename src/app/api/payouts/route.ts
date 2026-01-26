import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import Order from "@/models/Order";
import Payout from "@/models/Payout";
import Employee from "@/models/Employee";
import mongoose from "mongoose";


export async function POST() {
    try {
        await connectToDatabase();
        const session = await getSession();

        if (!session?.id) {
            return NextResponse.json({ message: "Неавторизовано" }, { status: 401 });
        }

        /**
         * 1. Беремо всі виконані замовлення
         */
        const orders = await Order.find({
            userId: session.id,
            status: "completed",
        });

        if (!orders.length) {
            return NextResponse.json(
                { message: "Немає замовлень для виплати" },
                { status: 400 }
            );
        }

        /**
         * 2. Групуємо роботи по працівниках
         */
        const employeeMap = new Map<string, {
            totalAmount: number;
            orderIds: mongoose.Types.ObjectId[];
        }>();

        for (const order of orders) {
            for (const work of order.works) {
                if (!work.employeeId) continue;

                const key = work.employeeId.toString();

                if (!employeeMap.has(key)) {
                    employeeMap.set(key, {
                        totalAmount: 0,
                        orderIds: []
                    });
                }

                const entry = employeeMap.get(key)!;
                entry.totalAmount += work.price || 0;

                if (!entry.orderIds.some(id => id.equals(order._id))) {
                    entry.orderIds.push(order._id);
                }
            }
        }

        /**
         * 3. Отримуємо всіх працівників
         */
        const employeeIds = Array.from(employeeMap.keys());
        const employees = await Employee.find({ _id: { $in: employeeIds } });

        const payouts = [];

        /**
         * 4. Створюємо payouts
         */
        for (const employee of employees) {
            const data = employeeMap.get(employee._id.toString());
            if (!data) continue;

            const commissionAmount = Math.round(
                data.totalAmount * (employee.commissionRate / 100)
            );

            const payout = await Payout.create({
                userId: session.id,
                employeeId: employee._id,
                totalAmount: data.totalAmount,
                totalCommission: commissionAmount,
                commission: employee.commissionRate,
                orders: data.orderIds
            });

            payouts.push(payout);
        }

        /**
         * 5. Архівуємо всі замовлення
         */
        await Order.updateMany(
            { _id: { $in: orders.map(o => o._id) } },
            { $set: { status: 'archived' } }
        );

        return NextResponse.json({ payouts }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Помилка масової виплати" },
            { status: 500 }
        );
    }
}
