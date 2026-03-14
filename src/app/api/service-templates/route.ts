import {connectToDatabase} from '@/lib/db';
import {getSession} from '@/lib/getSession';
import {NextResponse} from 'next/server';
import ServiceTemplate from '@/models/ServiceTemplate';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({message: 'Неавторизовано'}, {status: 401});
        }

        const template = await ServiceTemplate.findOne({
            userId: new mongoose.Types.ObjectId(session.id),
        });

        return NextResponse.json(
            template || {works: [], materials: [], packages: []}
        );
    } catch (error) {
        console.error('Get service templates error:', error);
        return NextResponse.json({message: 'Помилка отримання шаблонів'}, {status: 500});
    }
}

export async function PUT(req: Request) {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({message: 'Неавторизовано'}, {status: 401});
        }

        const body = await req.json();
        const {works, materials, packages} = body;

        const updated = await ServiceTemplate.findOneAndUpdate(
            {userId: new mongoose.Types.ObjectId(session.id)},
            {$set: {works, materials, packages}},
            {new: true, upsert: true}
        );

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update service templates error:', error);
        return NextResponse.json({message: 'Помилка збереження шаблонів'}, {status: 500});
    }
}