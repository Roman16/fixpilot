import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import Employee from "@/models/Employee";

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
            return NextResponse.json({message: "ID працівника обов’язкове"}, {status: 400});
        }

        const deleted = await Employee.findOneAndDelete({
            _id: id,
            userId: session.id,
        });

        if (!deleted) {
            return NextResponse.json({message: "Працівника не знайдено або вже видалено"}, {status: 404});
        }

        return NextResponse.json({message: "Працівник успішно видалений"}, {status: 200});
    } catch (error) {
        console.error("Delete employee error:", error);
        return NextResponse.json({message: "Сталась помилка при видаленні працівника"}, {status: 500});
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

        const updatedEmployee = await Employee.findOneAndUpdate(
            { _id: id, userId: session.id },
            {
                $set: {
                    name: body.name,
                    phone: body.phone,
                    role: body.role,
                    commission: body.commission,
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return NextResponse.json(
                { message: "Працівника не знайдено або оновлення не вдалося" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedEmployee, { status: 200 });
    } catch (error) {
        console.error("Update employee error:", error);
        return NextResponse.json(
            { message: "Сталась помилка при оновленні працівника" },
            { status: 500 }
        );
    }
}
