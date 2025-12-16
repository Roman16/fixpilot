import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import Client from "@/models/Client";
import mongoose from "mongoose";
import Order from "@/models/Order";

export async function DELETE(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    const sessionDb = await mongoose.startSession();

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

        sessionDb.startTransaction();

        const deletedClient = await Client.findOneAndDelete(
            {
                _id: id,
                userId: session.id,
            },
            {session: sessionDb}
        );

        if (!deletedClient) {
            await sessionDb.abortTransaction();
            return NextResponse.json(
                {message: "Клієнта не знайдено або вже видалено"},
                {status: 404}
            );
        }

        await Order.deleteMany(
            {
                clientId: id,
                userId: session.id,
            },
            {session: sessionDb}
        );

        await sessionDb.commitTransaction();

        return NextResponse.json({message: "Клієнт успішно видалений"}, {status: 200});
    } catch (error) {
        await sessionDb.abortTransaction();

        console.error("Delete client error:", error);
        return NextResponse.json({message: "Сталась помилка при видаленні клієнта"}, {status: 500});
    } finally {
        sessionDb.endSession();
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
