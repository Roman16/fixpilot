import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import {NextResponse} from "next/server";
import Employee from "@/models/Employee";

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }
        const body = await req.json();
        const {name, phone, commission, role} = body;

        const newEmployee = await Employee.create({
            name,
            phone,
            commission,
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

        const employees = await Employee.find({
            userId: session.id,
        })

        return NextResponse.json({
            data: employees,
        });
    } catch (error) {
        console.error("Load employees error:", error);
        return NextResponse.json({message: "Сталась помилка при отриманні працівників"}, {status: 500});
    }
}
