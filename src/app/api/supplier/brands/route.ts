import {NextResponse} from 'next/server';
import {connectToDatabase} from '@/lib/db';
import {getSession} from '@/lib/getSession';
import User from '@/models/User';
import {supplierRequest} from '@/lib/supplierSession';
import {parseBrands} from '@/lib/supplierParser';

export async function GET() {
    try {
        await connectToDatabase();
        const session = await getSession();
        if (!session?.id) return NextResponse.json({message: 'Неавторизовано'}, {status: 401});

        const user = await User.findById(session.id).select('supplierLogin supplierPassword');
        if (!user?.supplierLogin) {
            return NextResponse.json({message: 'Додайте логін та пароль постачальника в налаштуваннях'}, {status: 400});
        }

        const js = await supplierRequest(session.id, user.supplierLogin, user.supplierPassword, {
            act: 'getmanufacturerlist',
            selname: 'manuflistmoto',
            sys: '12',
        });

        return NextResponse.json({data: parseBrands(js)});
    } catch (error: any) {
        console.error('Supplier brands error:', error);
        return NextResponse.json({message: error.message || 'Помилка'}, {status: 500});
    }
}