import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {getSession} from "@/lib/getSession";
import Client from "@/models/Client";

export async function POST(req: Request) {
    try {
        await connectToDatabase();

        const session = await getSession();

        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }
        const body = await req.json();
        const {client: {name, phone, comment}} = body;

        const newClient = await new Client({
            name,
            phone,
            comment,
            userId: session.id,
        });

        await newClient.save();


        return NextResponse.json({
            message: "Клієнт створений успішно",
            data: newClient,
        }, {status: 201});
    } catch (error) {
        console.error("Create clients error:", error);
        return NextResponse.json({message: "Сталась помилка при створенні клієнта"}, {status: 500});
    }
}

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session || !session.id) {
            return NextResponse.json({message: "Неавторизовано"}, {status: 401});
        }

        const {searchParams} = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search")?.trim() || "";

        const query: any = {
            userId: session.id,
        };

        if (search) {
            query.$or = [
                {name: {$regex: search, $options: "i"}},
                {phone: {$regex: search, $options: "i"}},
            ];
        }

        const skip = (page - 1) * limit;

        const [clients, total] = await Promise.all([
            Client.find(query)
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit),
            Client.countDocuments(query),
        ]);

        return NextResponse.json({
            data: clients,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Load clients error:", error);
        return NextResponse.json({message: "Сталась помилка при отриманні клієнтів"}, {status: 500});
    }
}
