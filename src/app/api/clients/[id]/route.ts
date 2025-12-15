import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import Client from "@/models/Client";

export async function DELETE(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const {id} = await params;

        if (!id) {
            return NextResponse.json({message: "ID клієнта обов’язкове"}, {status: 400});
        }

        const deleted = await Client.findOneAndDelete({
            _id: id,
            userId: session.id,
        });

        if (!deleted) {
            return NextResponse.json({message: "Клієнта не знайдено або вже видалено"}, {status: 404});
        }

        return NextResponse.json({message: "Клієнт успішно видалений"}, {status: 200});
    } catch (error) {
        console.error("Delete client error:", error);
        return NextResponse.json({message: "Сталась помилка при видаленні клієнта"}, {status: 500});
    }
}

export async function PATCH(req: Request, context: any) {
    try {
        const params = await context.params;
        const id = params.id;

        await connectToDatabase();
        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const body = await req.json();

        if (!id || !body) {
            return NextResponse.json({message: "ID і дані обов’язкові"}, {status: 400});
        }

        const updatedClient = await Client.findOneAndUpdate(
            {_id: id, userId: session.id},
            {
                $set: {
                    name: body.client.name,
                    phone: body.client.phone,
                    comment: body.client.comment,
                }
            },
            {new: true}
        );

        if (!updatedClient) {
            return NextResponse.json(
                {message: "Клієнта не знайдено або оновлення не вдалося"},
                {status: 404}
            );
        }

        return NextResponse.json(updatedClient, {status: 200});
    } catch (error) {
        console.error("Update client error:", error);
        return NextResponse.json(
            {message: "Сталась помилка при оновленні клієнта"},
            {status: 500}
        );
    }
}
